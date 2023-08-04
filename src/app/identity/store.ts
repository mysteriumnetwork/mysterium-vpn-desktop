/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AppState, Identity, SSEEventType } from "mysterium-vpn-js"
import { action, computed, makeObservable, observable, reaction, runInAction, toJS } from "mobx"
import retry from "async-retry"
import _ from "lodash"
import BigNumber from "bignumber.js"

import { RootStore, Step } from "../store"
import { eventBus, tequilapi } from "../tequilapi"
import { log } from "../../shared/log/log"
import { ExportIdentityOpts, ImportIdentityOpts, mysteriumNodeIPC } from "../../shared/node/mysteriumNodeIPC"
import { analytics } from "../analytics/analytics"
import { EventName } from "../analytics/event"

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
            balanceSufficientToRegister: action,
            register: action,
            registerWithReferralToken: action,
            upgradeRequired: action,
            upgrade: action,
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
                balance: amount,
            })
        }, 60_000)
        reaction(
            () => Number(this.identity?.balanceTokens.human ?? 0),
            (balance) => {
                reportBalanceUpdate(balance)
            },
        )
    }

    async hasIdentities(): Promise<boolean> {
        const ids = await tequilapi.identityList()
        return ids.length > 0
    }

    async loadIdentity(): Promise<void> {
        log.info("Loading identity")
        const identity = await this.fetchIdentity()
        this.setIdentity(identity)
        await this.unlock()
        log.info("Identity loaded:", identity)
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

    async balanceSufficientToRegister(): Promise<boolean> {
        const { id, balanceTokens: balance } = this.requireId()

        // Check whether the user is eligible for free registration
        const eligibleForFreeRegistration = await tequilapi.freeRegistrationEligibility(id).then((res) => res.eligible)
        if (eligibleForFreeRegistration) {
            log.info("User is eligible for free registration")
            return true
        }

        // Fetch registration fees and compare with user's balance
        await this.root.payment.fetchTransactorFees()
        const registrationFee = this.root.payment.fees?.registration
        if (new BigNumber(balance.wei).isGreaterThan(new BigNumber(registrationFee?.wei ?? 0))) {
            log.info(`Balance is sufficient to register: ${balance.ether} >= ${registrationFee?.ether} (reg. fee)`)
            return true
        }

        log.info(`Balance is NOT sufficient to register: ${balance.ether} < ${registrationFee?.ether} (reg. fee)`)
        return false
    }

    async register(id: Identity, referralToken?: string): Promise<void> {
        log.info("Registering MysteriumID: ", toJS(id), referralToken ? `token: ${referralToken}` : "")
        await this.root.payment.fetchTransactorFees()
        try {
            await tequilapi.identityRegister(id.id, { stake: 0, referralToken })
        } catch (err) {
            log.error("Failed to register identity", err)
        }
    }

    requireId(): Identity {
        const id = this.identity
        if (!id) {
            throw Error("No Identity")
        }
        return id
    }

    async upgradeRequired(): Promise<boolean> {
        const id = this.requireId().id
        const res = await tequilapi.http.get(`identities/${id}/migrate-hermes/status`)
        const status = res?.status
        if (!status) {
            log.error("Cannot check for migration status")
            return false
        }
        if (status !== "required") {
            log.info("Migration is not required")
            return false
        }
        return true
    }

    async upgrade(): Promise<void> {
        const id = this.requireId().id
        await retry(
            async () => {
                const res = await tequilapi.http.post(`identities/${id}/migrate-hermes`, {}, 60_000)
                log.info("Migrate ID response:", JSON.stringify(res))
            },
            {
                retries: 10,
                factor: 1,
                onRetry: (e, attempt) => log.warn(`Retrying ID upgrade (${attempt}): ${e.message}`),
            },
        )
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
        this.root.startupSequence(Step.IDENTITY_CREATE_DONE)
        return String(res.result)
    }
}
