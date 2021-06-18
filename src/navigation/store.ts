/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable, observe, reaction } from "mobx"
import { ConnectionStatus } from "mysterium-vpn-js"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { userEvent } from "../analytics/analytics"
import { registered } from "../identity/identity"
import { MainIpcListenChannels } from "../main/ipc"
import { OnboardingAction } from "../analytics/actions"

import { AppLocation, locations } from "./locations"

const connectionInProgress = (status: ConnectionStatus): boolean => {
    return [ConnectionStatus.CONNECTED, ConnectionStatus.CONNECTING, ConnectionStatus.DISCONNECTING].includes(status)
}

export class NavigationStore {
    welcome = true
    menu = false
    chat = false

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            welcome: observable,
            menu: observable,
            chat: observable,
            showLoading: action,
            goHome: action,
            determineRoute: action,
            showWelcome: action,
            dismissWelcome: action,
            showMenu: action,
            openChat: action,
            isHomeActive: computed,
            isPreferencesActive: computed,
            isHelpActive: computed,
            isWalletActive: computed,
        })
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

    showLoading = (): void => {
        this.root.router.push(locations.loading)
    }

    goHome = (): void => {
        if (connectionInProgress(this.root.connection.status)) {
            this.root.router.push(locations.connection)
        } else {
            this.root.router.push(locations.proposals)
        }
    }

    determineRoute = (): void => {
        const newLocation = this.determineLocation()
        if (newLocation) {
            this.root.router.push(newLocation)
        }
    }

    determineLocation = (): AppLocation | undefined => {
        const { config, identity, connection } = this.root
        if (this.root.router.location.pathname == locations.wallet.path) {
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

    showWelcome = (): void => {
        this.welcome = true
    }

    dismissWelcome = (): void => {
        userEvent(OnboardingAction.GetStarted)
        this.welcome = false
        this.root.router.push(locations.terms)
    }

    showMenu = (show = true): void => {
        this.menu = show
    }

    openChat = (open = true): void => {
        this.chat = open
    }

    get isHomeActive(): boolean {
        return this.root.router.location.pathname.includes(locations.consumer.path)
    }

    get isPreferencesActive(): boolean {
        return this.root.router.location.pathname.includes(locations.preferences.path)
    }

    get isHelpActive(): boolean {
        return this.root.router.location.pathname.includes(locations.help.path)
    }

    get isWalletActive(): boolean {
        return this.root.router.location.pathname.includes(locations.wallet.path)
    }
}
