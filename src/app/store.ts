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
import { MainIpcListenChannels, WebIpcListenChannels } from "../shared/ipc"
import { isDevelopment } from "../utils/env"
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

export const createRootStore = (history: History): RootStore => {
    rootStore = new RootStore(history)
    StoreContext = React.createContext(rootStore)
    return rootStore
}

export let rootStore: RootStore
export let StoreContext: React.Context<RootStore>

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

    showGrid = false
    os = ""

    constructor(history: History) {
        makeObservable(this, {
            showGrid: observable,
            toggleGrid: action,
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

        document.addEventListener("keydown", (ev: KeyboardEvent) => {
            if (ev.code == "F5") {
                this.toggleGrid()
            }
        })

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
                    await Promise.all([
                        this.config.loadConfig().catch((reason) => {
                            log.warn("Could not load app config: ", reason)
                        }),
                        this.identity.loadIdentity().catch((reason) => {
                            log.warn("Could not load identity: ", reason)
                        }),
                    ])

                    await this.identity.registerIfNeeded()
                    this.navigation.navigateToInitialRoute()
                }
            },
        )
        window.addEventListener("online", () => console.log("online"))
        window.addEventListener("offline", () => console.log("offline"))
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

    toggleGrid = (): void => {
        if (isDevelopment()) {
            this.showGrid = !this.showGrid
        }
    }
}

ipcRenderer.on(WebIpcListenChannels.Disconnect, async () => {
    await rootStore.connection.disconnect()
})

configure({ enforceActions: "always" })

export const useStores = (): RootStore => React.useContext(StoreContext)
