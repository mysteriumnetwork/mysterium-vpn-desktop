/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { action, computed, configure, makeObservable, observable, reaction, runInAction } from "mobx"
import { ipcRenderer } from "electron"

// import { enableLogging } from "mobx-logger"

import { MainIpcListenChannels, WebIpcListenChannels } from "../shared/ipc"
import { isDevelopment } from "../utils/env"
import { AppStateAction } from "../shared/analytics/actions"
import { log } from "../shared/log/log"

import { NavigationStore } from "./navigation/store"
import { DaemonStatusType, DaemonStore } from "./daemon/store"
import { ConfigStore } from "./config/store"
import { IdentityStore } from "./identity/store"
import { ProposalStore } from "./proposals/store"
import { ConnectionStore } from "./connection/store"
import { PaymentStore } from "./payment/store"
import { FeedbackStore } from "./feedback/store"
import { RouterStore } from "./navigation/routerStore"
import { ReferralStore } from "./referral/store"
import { Filters } from "./config/filters"
import { OnboardingStore } from "./onboarding/store"
import { appStateEvent } from "./analytics/analytics"
import { registered } from "./identity/identity"

export class RootStore {
    navigation: NavigationStore
    router: RouterStore
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

    constructor() {
        makeObservable(this, {
            showGrid: observable,
            toggleGrid: action,
            os: observable,
            isWindows: computed,
            isMacOS: computed,
            isLinux: computed,
        })
        this.navigation = new NavigationStore(this)
        this.router = new RouterStore()
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
                appStateEvent(AppStateAction.DaemonStatus, status)
                if (status == DaemonStatusType.Up) {
                    await Promise.all([
                        this.config.loadConfig().catch((reason) => {
                            log.warn("Could not load app config: ", reason)
                        }),
                        this.identity
                            .loadIdentity()
                            .catch((reason) => {
                                log.warn("Could not load identity: ", reason)
                            })
                            .then(() => {
                                // A temporary measure to migrate to Testnet3
                                const id = this.identity.identity
                                log.info("Identity loaded:", JSON.stringify(id))
                                if (id && !registered(id)) {
                                    this.identity.register(id)
                                }
                            }),
                    ])
                    this.navigation.determineRoute()
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

export const rootStore = new RootStore()
export const StoreContext = React.createContext(rootStore)

ipcRenderer.on(WebIpcListenChannels.Disconnect, async () => {
    await rootStore.connection.disconnect()
})

configure({ enforceActions: "always" })

export const useStores = (): RootStore => React.useContext(StoreContext)
