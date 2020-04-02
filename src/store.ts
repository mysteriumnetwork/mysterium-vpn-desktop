/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { action, configure, observable } from "mobx"

import { DaemonStore } from "./daemon/store"
import { ConnectionStore } from "./connection/store"
import { IdentityStore } from "./identity/store"
import { ProposalStore } from "./proposals/store"
import { PaymentStore } from "./payment/store"
import { ConfigStore } from "./config/store"

// import { enableLogging } from "mobx-logger"

export class RootStore {
    daemon: DaemonStore
    config: ConfigStore
    connection: ConnectionStore
    identity: IdentityStore
    proposals: ProposalStore
    payment: PaymentStore

    @observable
    consumer = true
    @observable
    wallet = false

    @observable
    welcome = true

    constructor() {
        this.daemon = new DaemonStore()
        this.config = new ConfigStore(this)
        this.connection = new ConnectionStore(this)
        this.identity = new IdentityStore(this)
        this.proposals = new ProposalStore(this)
        this.payment = new PaymentStore(this)

        // Setup cross-store reactions after all injections.
        this.config.setupReactions()
        this.connection.setupReactions()
        this.identity.setupReactions()
        this.proposals.setupReactions()
    }

    @action
    showWelcome = (): void => {
        this.welcome = true
    }

    @action
    dismissWelcome = (): void => {
        this.welcome = false
    }

    @action
    navigateToConsumer = (): void => {
        this.consumer = true
        this.wallet = false
    }

    @action
    navigateToWallet = (): void => {
        this.consumer = false
        this.wallet = true
    }
}

export const rootStore = new RootStore()
export const storesContext = React.createContext(rootStore)

// enableLogging()

configure({ enforceActions: "always" })

export const useStores = (): RootStore => React.useContext(storesContext)
