/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import tequilapi, { AppState, Identity, SSEEventType } from "mysterium-vpn-js"
import { action, observable, reaction } from "mobx"

import { RootStore } from "../store"
import { eventBus } from "../tequila-sse"
import { analytics } from "../analytics/analytics-ui"
import { Category, IdentityAction, WalletAction } from "../analytics/analytics"
import { log } from "../log/log"

import { eligibleForRegistration, registered } from "./identity"

export class IdentityStore {
    @observable
    loading = false
    @observable
    identity?: Identity
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
                await this.unlock()
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
                analytics.event(Category.Identity, IdentityAction.RegistrationStatusChanged, status)
            },
        )
        reaction(
            () => this.identity?.balance,
            (balance) => {
                analytics.event(Category.Wallet, WalletAction.BalanceChanged, balance ? String(balance) : undefined)
            },
        )
    }

    @action
    refreshIdentity = (identities: Identity[]): void => {
        if (!this.identity) {
            return
        }
        const matchingId = identities.find((id) => id.id == this.identity?.id)
        if (!matchingId) {
            this.setIdentity(undefined)
            return
        }
        this.identity.balance = matchingId.balance
        this.identity.registrationStatus = matchingId.registrationStatus
        if (registered(matchingId)) {
            this.root.navigation.determineRoute()
        }
    }

    @action
    async create(): Promise<void> {
        analytics.event(Category.Identity, IdentityAction.CreateIdentity)
        await tequilapi.identityCreate("")
    }

    @action
    async unlock(): Promise<void> {
        if (!this.identity) {
            return
        }
        const i = this.identity.id
        analytics.event(Category.Identity, IdentityAction.UnlockIdentity)
        return await tequilapi.identityUnlock(i, "", 10000)
    }

    @action
    async register(id: Identity): Promise<void> {
        if (!this.root.payment?.fees) {
            await this.root.payment.fetchTransactorFees()
        }
        const registrationFee = this.root.payment.fees?.registration
        if (!registrationFee) {
            log.error("Registration fee is unknown, can't proceed with the registration")
            return
        }
        const requiredTopup = this.root.payment.registrationTopup
        if (!requiredTopup) {
            log.error("Registration topup amount is unknown, can't proceed with the registration")
            return
        }
        if (id.balance < requiredTopup) {
            log.info(`Balance is less than the required topup amount: ${id.balance} < ${requiredTopup}, can't register`)
            return
        }
        analytics.event(Category.Identity, IdentityAction.RegisterIdentity)
        return tequilapi.identityRegister(id.id, { fee: registrationFee })
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
