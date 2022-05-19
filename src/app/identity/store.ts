/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { AppState, Identity, IdentityRegistrationStatus, SSEEventType, Tokens } from "mysterium-vpn-js"
import { action, computed, makeObservable, observable, reaction, runInAction, toJS } from "mobx"
import retry from "async-retry"
import _ from "lodash"
import BigNumber from "bignumber.js"

import { RootStore } from "../store"
import { eventBus, tequilapi } from "../tequilapi"
import { log } from "../../shared/log/log"
import { PushTopic } from "../../shared/push/topics"
import { subscribePush, unsubscribePush } from "../push/push"
import { ExportIdentityOpts, ImportIdentityOpts, mysteriumNodeIPC } from "../../shared/node/mysteriumNodeIPC"
import { analytics } from "../analytics/analytics"
import { EventName } from "../analytics/event"
import { locations } from "../navigation/locations"

const registrationPossible = (status: IdentityRegistrationStatus): boolean => {
    return ![
        IdentityRegistrationStatus.Registered,
        IdentityRegistrationStatus.InProgress,
        IdentityRegistrationStatus.Unknown,
    ].includes(status)
}

type IdUpgradeStatus = "unknown" | "required" | "finished"

export class IdentityStore {
    loading = false
    identity?: Identity
    unlocked = false
    identities: Identity[] = []
    upgradeStatus: IdUpgradeStatus = "unknown"

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
            upgradeRequired: action,
            upgrade: action,
            upgradeStatus: observable,
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
                if (balance != null && balance < 0.5) {
                    subscribePush(PushTopic.LessThanHalfMyst)
                } else {
                    unsubscribePush(PushTopic.LessThanHalfMyst)
                }
                reportBalanceUpdate(balance)
            },
        )
        reaction(() => this.identity?.balanceTokens, this.registerOnBalanceChange)
        reaction(() => this.identity?.registrationStatus, this.navigateOnStatusChange)
        reaction(() => this.upgradeStatus, this.navigationOnIdUpgradeStatusChange)
    }

    registerOnBalanceChange = async (balanceTokens?: Tokens): Promise<void> => {
        if (!this.identity) {
            return
        }
        if (!registrationPossible(this.identity.registrationStatus)) {
            return
        }
        if (!balanceTokens?.wei) {
            return
        }
        await this.root.payment.fetchTransactorFees()
        const registrationFee = new BigNumber(this.root.payment.fees?.registration.wei ?? 0)
        const balance = new BigNumber(balanceTokens?.wei ?? 0)
        if (balance.isLessThan(registrationFee)) {
            log.info("Balance is insufficient to register")
            return
        }
        log.info("Balance is sufficient for registration")
        return await this.register(this.identity)
    }

    navigateOnStatusChange = (status?: IdentityRegistrationStatus): void => {
        switch (status) {
            case IdentityRegistrationStatus.InProgress:
            case IdentityRegistrationStatus.RegistrationError:
                this.root.navigation.push(locations.registering)
                return
            case IdentityRegistrationStatus.Registered:
                if (this.upgradeStatus === "finished") {
                    this.root.navigation.goHome()
                }
        }
    }

    navigationOnIdUpgradeStatusChange = (status: IdUpgradeStatus): void => {
        switch (status) {
            case "finished":
                this.root.navigation.navigateToInitialRoute()
        }
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

    async registerIfNeeded(): Promise<void> {
        if (!this.identity) {
            log.info("No ID")
            return
        }
        const { id, registrationStatus: status, balanceTokens } = this.identity
        if (!registrationPossible(status)) {
            log.info(`Status ${status} cannot be registered`) // Identity is already registered or status is unknown
            return
        }
        const eligibleForFreeRegistration = await tequilapi.freeRegistrationEligibility(id).then((res) => res.eligible)
        log.info("Free registration eligibility:", eligibleForFreeRegistration)
        if (eligibleForFreeRegistration) {
            log.info("Attempting to register for free")
            await this.register(this.identity)
            return
        }
        await this.root.payment.fetchTransactorFees()
        log.info("Registration fee:", this.root.payment.fees?.registration.ether)

        const registrationFee = new BigNumber(this.root.payment.fees?.registration.wei ?? 0)
        const balance = new BigNumber(balanceTokens.wei)
        if (balance.isLessThan(registrationFee)) {
            log.info("Balance is insufficient to register")
            return
        }
        log.info("Balance is sufficient for registration")
        await this.register(this.identity)
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

    requireId(): string {
        const id = this.identity?.id
        if (!id) {
            throw Error("No Identity")
        }
        return id
    }

    async upgradeRequired(): Promise<boolean> {
        const id = this.requireId()
        const res = await tequilapi.http.get(`identities/${id}/migrate-hermes/status`)
        const status = res?.status
        if (!status) {
            log.error("Cannot check for migration status")
            return false
        }
        if (status !== "required") {
            log.info("Migration is not required")
            this.upgradeStatus = "finished"
            return false
        }
        return true
    }

    async upgrade(): Promise<void> {
        const id = this.requireId()
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
        if (this.identity && this.identity?.registrationStatus !== IdentityRegistrationStatus.Registered) {
            await this.register(this.identity)
        }
        if (await this.upgradeRequired()) {
            await this.upgrade()
        }
        return String(res.result)
    }
}
