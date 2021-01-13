/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable, reaction } from "mobx"
import { ConnectionStatus } from "mysterium-vpn-js"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { analytics } from "../analytics/analytics-ui"
import { Category, OnboardingAction } from "../analytics/analytics"
import { registered } from "../identity/identity"
import { MainIpcListenChannels } from "../main/ipc"

import { locations } from "./locations"

const connectionInProgress = (status: ConnectionStatus): boolean => {
    return [ConnectionStatus.CONNECTED, ConnectionStatus.CONNECTING, ConnectionStatus.DISCONNECTING].includes(status)
}

export class NavigationStore {
    @observable
    consumer = true
    @observable
    welcome = true
    @observable
    menu = false
    @observable
    preferences = false
    @observable
    chat = false
    @observable
    report = false

    //top navbar bar
    @observable
    wallet = false
    @observable
    filters = false
    @observable
    referrals = false

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        reaction(() => this.root.connection.status, this.determineRoute)
        reaction(() => this.root.identity.identity?.registrationStatus, this.determineRoute)
        reaction(
            () => this.chat,
            (chatOpen) => {
                ipcRenderer.send(MainIpcListenChannels.ToggleSupportChat, chatOpen)
            },
        )
    }

    @action
    showLoading = (): void => {
        this.root.router.push(locations.loading)
    }

    @action
    determineRoute = (): void => {
        const newLocation = this.determineLocation()
        if (newLocation) {
            this.root.router.push(newLocation)
        }
    }

    determineLocation = (): string | undefined => {
        const { config, identity, connection } = this.root
        if (this.root.router.location.pathname == locations.wallet) {
            return undefined
        }
        if (this.root.router.location.pathname == locations.topup) {
            return undefined
        }

        if (!config.currentTermsAgreed() && this.welcome) {
            return locations.welcome
        }
        if (!config.currentTermsAgreed()) {
            return locations.terms
        }
        if (!identity.identity || !registered(identity.identity)) {
            return locations.loading
        }
        if (connectionInProgress(connection.status)) {
            return locations.connection
        }
        return locations.proposals
    }

    @action
    showWelcome = (): void => {
        this.welcome = true
    }

    @action
    dismissWelcome = (): void => {
        analytics.event(Category.Onboarding, OnboardingAction.GetStarted)
        this.welcome = false
        this.root.router.push(locations.terms)
    }

    @action
    toggleWallet = (): void => {
        this.wallet = !this.wallet
        if (this.filters) {
            this.filters = false
        }
        if (this.referrals) {
            this.referrals = false
        }
    }

    @action
    toggleFilters = (): void => {
        this.filters = !this.filters
        if (this.wallet) {
            this.wallet = false
        }
        if (this.referrals) {
            this.referrals = false
        }
    }

    @action
    toggleReferrals = (): void => {
        this.referrals = !this.referrals
        if (this.wallet) {
            this.wallet = false
        }
        if (this.filters) {
            this.filters = false
        }
    }

    @action
    showMenu = (show = true): void => {
        this.menu = show
    }

    @action
    openChat = (open = true): void => {
        this.chat = open
    }

    @action
    openReportIssue = (open = true): void => {
        this.report = open
    }

    @action
    openPreferences = (open = true): void => {
        this.preferences = open
    }

    @action
    toggleTopupWindow = (): void => {
        ipcRenderer.send(MainIpcListenChannels.TopupWindow)
    }
}
