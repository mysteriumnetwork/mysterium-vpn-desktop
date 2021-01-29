/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, observe, reaction } from "mobx"
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
    welcome = true
    @observable
    menu = false
    @observable
    chat = false

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        observe(
            computed(() => this.root.identity.identity?.registrationStatus),
            ({ oldValue, newValue }) => {
                if (oldValue != newValue) {
                    this.determineRoute()
                }
            },
        )
        reaction(
            () => this.root.connection.status,
            () => {
                this.determineRoute()
            },
        )
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
    goHome = (): void => {
        if (connectionInProgress(this.root.connection.status)) {
            this.root.router.push(locations.connection)
        } else {
            this.root.router.push(locations.proposals)
        }
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
    showMenu = (show = true): void => {
        this.menu = show
    }

    @action
    openChat = (open = true): void => {
        this.chat = open
    }

    @action
    toggleTopupWindow = (): void => {
        ipcRenderer.send(MainIpcListenChannels.TopupWindow)
    }
}
