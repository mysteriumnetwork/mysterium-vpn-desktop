/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { action, computed, configure, makeObservable, observable, reaction, runInAction } from "mobx"
import { ipcRenderer } from "electron"
import { History } from "history"
// import { enableLogging } from "mobx-logger"
import { IdentityRegistrationStatus } from "mysterium-vpn-js"

import { MainIpcListenChannels, WebIpcListenChannels } from "../shared/ipc"
import { log } from "../shared/log/log"

import { NavigationStore } from "./navigation/store"
import { DaemonStatusType, DaemonStore } from "./daemon/store"
import { ConfigStore } from "./config/store"
import { IdentityStore } from "./identity/store"
import { ProposalStore } from "./proposals/store"
import { ConnectionStore } from "./connection/store"
import { PaymentStore } from "./payment/store"
import { FeedbackStore } from "./feedback/store"
import { ReferralStore } from "./referral/store"
import { Filters } from "./config/filters"
import { OnboardingStore } from "./onboarding/store"
import { analytics } from "./analytics/analytics"
import { EventName } from "./analytics/event"
import { locations } from "./navigation/locations"

export const createRootStore = (history: History): RootStore => {
    rootStore = new RootStore(history)
    StoreContext = React.createContext(rootStore)
    return rootStore
}

export let rootStore: RootStore
export let StoreContext: React.Context<RootStore>

export enum Step {
    START = 0,
    WELCOME,
    WELCOME_DONE,
    TERMS,
    TERMS_DONE,
    ONBOARDING_STEPS,
    ONBOARDING_STEPS_DONE,
    IDENTITY_CREATE,
    IDENTITY_CREATE_DONE,
    IDENTITY_UPGRADE,
    IDENTITY_UPGRADE_DONE,
    IDENTITY_REGISTER,
    IDENTITY_REGISTER_DONE,
    COMPLETE,
}

export class RootStore {
    navigation: NavigationStore
    daemon: DaemonStore
    config: ConfigStore
    filters: Filters
    identity: IdentityStore
    onboarding: OnboardingStore
    proposals: ProposalStore
    connection: ConnectionStore
    payment: PaymentStore
    feedback: FeedbackStore
    referral: ReferralStore

    os = ""

    constructor(history: History) {
        makeObservable(this, {
            startupSequence: action,
            os: observable,
            isWindows: computed,
            isMacOS: computed,
            isLinux: computed,
        })
        this.navigation = new NavigationStore(this, history)
        this.daemon = new DaemonStore(this)
        this.config = new ConfigStore(this)
        this.filters = new Filters(this)
        this.identity = new IdentityStore(this)
        this.onboarding = new OnboardingStore(this)
        this.proposals = new ProposalStore(this)
        this.connection = new ConnectionStore(this)
        this.payment = new PaymentStore(this)
        this.feedback = new FeedbackStore(this)
        this.referral = new ReferralStore(this)

        // Setup cross-store reactions after all injections.
        this.daemon.setupReactions()
        this.filters.setupReactions()
        this.identity.setupReactions()
        this.proposals.setupReactions()
        this.payment.setupReactions()
        this.connection.setupReactions()
        this.setupReactions()

        ipcRenderer.invoke(MainIpcListenChannels.GetOS).then((os) => {
            runInAction(() => {
                this.os = os
            })
        })
    }

    setupReactions(): void {
        reaction(
            () => this.daemon.status,
            async (status) => {
                if (status == DaemonStatusType.Up) {
                    analytics.event(EventName.startup)
                    log.info("[startup] Startup sequence start")
                    await Promise.all([
                        this.config.loadConfig().catch((reason) => {
                            log.warn("Could not load app config: ", reason)
                        }),
                        this.identity.loadIdentity().catch((reason) => {
                            log.warn("Could not load identity: ", reason)
                        }),
                    ])
                    await this.startupSequence(Step.START)
                }
            },
        )
        window.addEventListener("online", () => console.log("online"))
        window.addEventListener("offline", () => console.log("offline"))
    }

    async startupSequence(resumeFromStep: Step): Promise<void> {
        /* eslint-disable @typescript-eslint/ban-ts-comment */ //
        // noinspection FallThroughInSwitchStatementJS
        switch (resumeFromStep) {
            // @ts-ignore
            case Step.START:
                log.info("[startup] START")
            // @ts-ignore
            case Step.WELCOME:
                log.info("[startup] WELCOME")
                if (!this.config.onboarded) {
                    log.info("[startup] User not onboarded, redirecting ->", locations.onboardingWelcome)
                    this.navigation.push(locations.onboardingWelcome)
                    return
                }
            // @ts-ignore
            case Step.WELCOME_DONE:
                log.info("[startup] WELCOME_DONE")
            // @ts-ignore
            case Step.TERMS:
                log.info("[startup] TERMS")
                if (!this.config.currentTermsAgreed) {
                    log.info("[startup] Terms of use not accepted, redirecting ->", locations.terms)
                    this.navigation.push(locations.terms)
                    return
                }
            // @ts-ignore
            case Step.TERMS_DONE:
                log.info("[startup] TERMS_DONE")
            // @ts-ignore
            case Step.ONBOARDING_STEPS:
                log.info("[startup] ONBOARDING_STEPS")
                if (!this.config.onboarded) {
                    log.info("[startup] User not onboarded, redirecting ->", locations.onboardingIntroIndex)
                    this.navigation.push(locations.onboardingIntroIndex)
                    return
                }
            // @ts-ignore
            case Step.ONBOARDING_STEPS_DONE:
                log.info("[startup] ONBOARDING_STEPS_DONE")
            // @ts-ignore
            case Step.IDENTITY_CREATE:
                log.info("[startup] IDENTITY_CREATE")
                if (!this.identity.identityExists) {
                    log.info("[startup] No identity exists, redirecting ->", locations.onboardingIdentitySetup)
                    this.navigation.push(locations.onboardingIdentitySetup)
                    return
                }
            // @ts-ignore
            case Step.IDENTITY_CREATE_DONE:
                log.info("[startup] IDENTITY_CREATE_DONE")
            // @ts-ignore
            case Step.IDENTITY_UPGRADE:
                log.info("[startup] IDENTITY_UPGRADE")
                if (await this.identity.upgradeRequired()) {
                    log.info("[startup] ID upgrade is required, redirecting ->", locations.idUpgrading)
                    this.navigation.push(locations.idUpgrading)
                    return
                }
            // @ts-ignore
            case Step.IDENTITY_UPGRADE_DONE:
                log.info("[startup] IDENTITY_UPGRADE_DONE")
            // @ts-ignore
            case Step.IDENTITY_REGISTER:
                log.info("[startup] IDENTITY_REGISTER")
                const id = this.identity.requireId()
                switch (id.registrationStatus) {
                    case IdentityRegistrationStatus.Unknown:
                        // Unable to check ID status - halt startup sequence
                        return
                    case IdentityRegistrationStatus.Unregistered:
                    case IdentityRegistrationStatus.RegistrationError:
                        if (await this.identity.balanceSufficientToRegister()) {
                            this.navigation.push(locations.idRegistering)
                            await this.identity.register(id)
                            return
                        } else {
                            this.navigation.push(locations.onboardingTopupPrompt)
                            return
                        }
                    case IdentityRegistrationStatus.InProgress:
                        this.navigation.push(locations.idRegistering)
                        return
                    case IdentityRegistrationStatus.Registered:
                }
            // @ts-ignore
            case Step.IDENTITY_REGISTER_DONE:
                log.info("[startup] IDENTITY_REGISTER_DONE")
            // @ts-ignore
            case Step.COMPLETE:
                log.info("[startup] COMPLETE")
                this.navigation.navigateToInitialRoute()
        }
        /* eslint-enable @typescript-eslint/ban-ts-comment */ //
    }

    get isWindows(): boolean {
        return this.os === "win32"
    }

    get isMacOS(): boolean {
        return this.os === "darwin"
    }

    get isLinux(): boolean {
        return !this.isWindows && !this.isMacOS
    }
}

ipcRenderer.on(WebIpcListenChannels.Disconnect, async () => {
    await rootStore.connection.disconnect()
})

configure({ enforceActions: "always" })

export const useStores = (): RootStore => React.useContext(StoreContext)
