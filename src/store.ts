/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { action, configure, observable } from "mobx"
import { ipcRenderer } from "electron"
// import { enableLogging } from "mobx-logger"

import { NavigationStore } from "./navigation/store"
import { DaemonStore } from "./daemon/store"
import { ConfigStore } from "./config/store"
import { IdentityStore } from "./identity/store"
import { ProposalStore } from "./proposals/store"
import { ConnectionStore } from "./connection/store"
import { PaymentStore } from "./payment/store"
import { WebIpcListenChannels } from "./main/ipc"
import { FeedbackStore } from "./feedback/store"
import { isDevelopment } from "./utils/env"
import { RouterStore } from "./navigation/routerStore"
import { ReferralStore } from "./referral/store"
import { Filters } from "./config/filters"

export class RootStore {
    navigation: NavigationStore
    router: RouterStore
    daemon: DaemonStore
    config: ConfigStore
    filters: Filters
    identity: IdentityStore
    proposals: ProposalStore
    connection: ConnectionStore
    payment: PaymentStore
    feedback: FeedbackStore
    referral: ReferralStore

    @observable
    showGrid = false

    constructor() {
        this.navigation = new NavigationStore(this)
        this.router = new RouterStore()
        this.daemon = new DaemonStore(this)
        this.config = new ConfigStore(this)
        this.filters = new Filters(this)
        this.identity = new IdentityStore(this)
        this.proposals = new ProposalStore(this)
        this.connection = new ConnectionStore(this)
        this.payment = new PaymentStore(this)
        this.feedback = new FeedbackStore(this)
        this.referral = new ReferralStore(this)

        // Setup cross-store reactions after all injections.
        this.navigation.setupReactions()
        this.daemon.setupReactions()
        this.config.setupReactions()
        this.filters.setupReactions()
        this.identity.setupReactions()
        this.proposals.setupReactions()
        this.payment.setupReactions()
        this.connection.setupReactions()
        this.referral.setupReactions()

        document.addEventListener("keydown", (ev: KeyboardEvent) => {
            if (ev.code == "F5") {
                this.toggleGrid()
            }
        })
    }

    @action
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
// enableLogging()

configure({ enforceActions: "always" })

export const useStores = (): RootStore => React.useContext(StoreContext)
