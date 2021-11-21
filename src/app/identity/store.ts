/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AppState, Identity, IdentityRegistrationStatus, SSEEventType } from "mysterium-vpn-js"
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx"
import retry from "async-retry"
import _ from "lodash"

import { RootStore } from "../store"
import { eventBus, tequilapi } from "../tequilapi"
import { log } from "../../shared/log/log"
import { decimalPart, fmtMoney } from "../payment/display"
import { PushTopic } from "../../shared/push/topics"
import { subscribePush, unsubscribePush } from "../push/push"
import { ExportIdentityOpts, ImportIdentityOpts, mysteriumNodeIPC } from "../../shared/node/mysteriumNodeIPC"
import { analytics } from "../analytics/analytics"
import { EventName } from "../analytics/event"

import { registered } from "./identity"

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
        const reportBalanceUpdate = _.debounce((amount: number) => {
            analytics.event(EventName.balance_update, {
                balance: Number(
                    fmtMoney(
                        {
                            amount,
                            currency: this.root.payment.appCurrency,
                        },
                        { showCurrency: false },
                    ),
                ),
            })
        }, 60_000)
        reaction(
            () => this.identity?.balance,
            (balance) => {
                if (balance != null && balance / decimalPart() < 0.5) {
                    subscribePush(PushTopic.LessThanHalfMyst)
                } else {
                    unsubscribePush(PushTopic.LessThanHalfMyst)
                }
                reportBalanceUpdate(this.root.identity.identity?.balance ?? 0)
            },
        )
        reaction(
            () => this.identity?.balance,
            async (balance) => {
                if (!this.identity) {
                    return
                }
                if (registered(this.identity)) {
                    return
                }
                if (!balance) {
                    return
                }
                await this.register(this.identity)
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
        const MAX_RETRIES = 10
        return await retry(
            async () => {
                return tequilapi.identity(current.id)
            },
            {
                retries: MAX_RETRIES,
                onRetry: (e, attempt) => log.warn(`Failed to get identity (${attempt}/${MAX_RETRIES}): ${e.message}`),
            },
        ).catch((reason) => {
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
        try {
            await tequilapi.identityCreate("")
        } catch (err) {
            log.error("Failed to create ID", err)
        }
    }

    async unlock(): Promise<void> {
        if (this.unlocked) {
            return
        }
        if (!this.identity) {
            return
        }
        const i = this.identity.id
        try {
            await tequilapi.identityUnlock(i, "", 10_000)
            runInAction(() => {
                this.unlocked = true
            })
        } catch (err) {
            log.error("Failed to unlock identity", err)
        }
    }

    async register(id: Identity, referralToken?: string): Promise<void> {
        await this.root.payment.fetchTransactorFees()
        try {
            await tequilapi.identityRegister(id.id, { stake: 0, referralToken })
        } catch (err) {
            log.error("Failed to register identity", err)
        }
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

    async refreshBalance(): Promise<void> {
        if (!this.identity) {
            return
        }
        await tequilapi.identityBalanceRefresh(this.identity.id)
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

    async exportIdentity(opts: ExportIdentityOpts): Promise<string> {
        const res = await mysteriumNodeIPC.exportIdentity(opts)
        if (res.error) {
            return Promise.reject(res.error)
        }
        return String(res.result)
    }

    importIdentityChooseFile(): Promise<string> {
        return mysteriumNodeIPC.importIdentityChooseFile()
    }

    async importIdentity(opts: ImportIdentityOpts): Promise<string> {
        const res = await mysteriumNodeIPC.importIdentity(opts)
        if (res.error) {
            return Promise.reject(res.error)
        }
        await this.loadIdentity()
        if (this.identity && this.identity?.registrationStatus !== IdentityRegistrationStatus.Registered) {
            await this.register(this.identity)
        }
        return String(res.result)
    }
}
