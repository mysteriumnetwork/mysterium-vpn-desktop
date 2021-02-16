/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AppState, Identity, SSEEventType } from "mysterium-vpn-js"
import { action, observable, reaction, runInAction } from "mobx"

import { RootStore } from "../store"
import { eventBus } from "../tequila-sse"
import { appStateEvent } from "../analytics/analytics"
import { tequilapi } from "../tequilapi"
import { AppStateAction } from "../analytics/actions"

import { eligibleForRegistration, registered } from "./identity"

export class IdentityStore {
    @observable
    loading = false
    @observable
    identity?: Identity
    @observable
    unlocked = false
    @observable
    identities: Identity[] = []

    root: RootStore

    constructor(root: RootStore) {
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
                if (!this.identity) {
                    const id = identities.find((id) => registered(id) || eligibleForRegistration(id))
                    if (id) {
                        this.setIdentity(id)
                    } else {
                        await this.create()
                    }
                }
            },
            { name: "Get/create an identity from the list" },
        )
        reaction(
            () => this.identity,
            async (identity) => {
                if (!identity) {
                    return
                }
                if (!this.unlocked) {
                    await this.unlock()
                }
                if (!registered(identity)) {
                    await this.root.payment.fetchTransactorFees()
                }
                if (eligibleForRegistration(identity)) {
                    await this.register(identity)
                }
            },
            { name: "Unlock/register current identity" },
        )
        reaction(
            () => this.identity?.balance,
            async () => {
                if (!this.identity) {
                    return
                }
                if (!this.identity.balance) {
                    await this.unlock()
                }
                if (!registered(this.identity)) {
                    await this.register(this.identity)
                }
            },
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

    @action
    refreshIdentity = (identities: Identity[]): void => {
        if (!this.identity) {
            return
        }
        const matchingId = identities.find((id) => id.id == this.identity?.id)

        this.setIdentity(matchingId)
    }

    @action
    async create(): Promise<void> {
        appStateEvent(AppStateAction.IdentityCreate)
        await tequilapi.identityCreate("")
    }

    @action
    async unlock(): Promise<void> {
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

    @action
    async register(id: Identity): Promise<void> {
        await this.root.payment.fetchTransactorFees()
        appStateEvent(AppStateAction.IdentityRegister)
        return tequilapi.identityRegister(id.id, { stake: 0 })
    }

    @action
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

    @action
    setLoading = (b: boolean): void => {
        this.loading = b
    }

    @action
    setIdentity = (identity?: Identity): void => {
        this.identity = identity
    }

    @action
    setIdentities = (identities: Identity[]): void => {
        this.identities = identities
    }
}
