/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AppState, Identity, SSEEventType } from "mysterium-vpn-js"
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { eventBus } from "../tequila-sse"
import { appStateEvent } from "../analytics/analytics"
import { tequilapi } from "../tequilapi"
import { AppStateAction } from "../../shared/analytics/actions"
import { IpcResponse, MainIpcListenChannels } from "../../shared/ipc"
import { ImportIdentityOpts } from "../../shared/supervisor"

export class IdentityStore {
    loading = false
    identity?: Identity
    unlocked = false
    identities: Identity[] = []

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            loading: observable,
            identity: observable,
            unlocked: observable,
            identities: observable,
            refreshIdentity: action,
            create: action,
            loadIdentity: action,
            identityExists: computed,
            fetchIdentity: action,
            hasIdentities: action,
            unlock: action,
            register: action,
            registerWithReferralToken: action,
            setLoading: action,
            setIdentity: action,
            setIdentities: action,
            exportIdentity: action,
            importIdentityChooseFile: action,
            importIdentity: action,
        })
        this.root = root
    }

    setupReactions(): void {
        eventBus.on(SSEEventType.AppStateChange, (state: AppState) => {
            this.setIdentities(state.identities ?? [])
        })
        reaction(
            () => this.identities,
            async (identities) => {
                this.refreshIdentity(identities)
            },
            { name: "Refresh identity from node state" },
        )
        // analytics
        reaction(
            () => this.identity?.registrationStatus,
            (status) => {
                appStateEvent(AppStateAction.IdentityStatus, status)
            },
        )
        reaction(
            () => this.identity?.balance,
            (balance) => {
                appStateEvent(AppStateAction.BalanceChanged, String(balance))
            },
        )
    }

    async hasIdentities(): Promise<boolean> {
        const ids = await tequilapi.identityList()
        return ids.length > 0
    }

    async loadIdentity(): Promise<void> {
        const identity = await this.fetchIdentity()
        this.setIdentity(identity)
        return await this.unlock()
    }

    get identityExists(): boolean {
        return this.identity?.id != null
    }

    async fetchIdentity(): Promise<Identity | undefined> {
        const ids = await tequilapi.identityList()
        if (ids.length < 1) {
            return undefined
        }
        const current = await tequilapi.identityCurrent({ passphrase: "" }).catch((reason) => {
            throw Error("Could not get current identity ref: " + reason)
        })
        return await tequilapi.identity(current.id).catch((reason) => {
            throw Error("Could not get identity: " + reason)
        })
    }

    refreshIdentity = (identities: Identity[]): void => {
        if (!this.identity) {
            return
        }
        const matchingId = identities.find((id) => id.id == this.identity?.id)

        this.setIdentity(matchingId)
    }

    async create(): Promise<void> {
        appStateEvent(AppStateAction.IdentityCreate)
        await tequilapi.identityCreate("")
    }

    async unlock(): Promise<void> {
        if (this.unlocked) {
            return
        }
        if (!this.identity) {
            return
        }
        const i = this.identity.id
        appStateEvent(AppStateAction.IdentityUnlock)
        await tequilapi.identityUnlock(i, "", 10000)
        runInAction(() => {
            this.unlocked = true
        })
    }

    async register(id: Identity): Promise<void> {
        await this.root.payment.fetchTransactorFees()
        appStateEvent(AppStateAction.IdentityRegister)
        return tequilapi.identityRegister(id.id, { stake: 0 })
    }

    async registerWithReferralToken(token: string): Promise<void> {
        if (!this.identity) {
            return
        }
        this.setLoading(true)
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await tequilapi.identityRegister(this.identity?.id, { token })
        } finally {
            this.setLoading(false)
        }
    }

    setLoading = (b: boolean): void => {
        this.loading = b
    }

    setIdentity = (identity?: Identity): void => {
        this.identity = identity
    }

    setIdentities = (identities: Identity[]): void => {
        this.identities = identities
    }

    exportIdentity({ id, passphrase }: { id: string; passphrase: string }): Promise<IpcResponse> {
        return ipcRenderer.invoke(MainIpcListenChannels.ExportIdentity, id, passphrase)
    }

    importIdentityChooseFile(): Promise<string> {
        return ipcRenderer
            .invoke(MainIpcListenChannels.ImportIdentityChooseFile)
            .then((result: IpcResponse) => result.result as string)
    }

    async importIdentity(opts: ImportIdentityOpts): Promise<IpcResponse> {
        const importResult = await ipcRenderer.invoke(MainIpcListenChannels.ImportIdentity, opts)
        await this.loadIdentity()
        return importResult
    }
}
