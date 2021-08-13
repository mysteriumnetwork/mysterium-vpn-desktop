/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable } from "mobx"
import { ConnectionStatus } from "mysterium-vpn-js"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { userEvent } from "../analytics/analytics"
import { MainIpcListenChannels } from "../../shared/ipc"
import { OnboardingAction, OtherAction } from "../../shared/analytics/actions"
import { registered } from "../identity/identity"

import { locations } from "./locations"

const connectionInProgress = (status: ConnectionStatus): boolean => {
    return [ConnectionStatus.CONNECTED, ConnectionStatus.CONNECTING, ConnectionStatus.DISCONNECTING].includes(status)
}

export class NavigationStore {
    welcome = true
    menu = false

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            welcome: observable,
            menu: observable,
            showLoading: action,
            goHome: action,
            determineRoute: action,
            showWelcome: action,
            dismissWelcome: action,
            showMenu: action,
            openChat: action,
            isHomeActive: computed,
            isSettingsActive: computed,
            isHelpActive: computed,
            isWalletActive: computed,
        })
        this.root = root
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

    determineLocation = (): string | undefined => {
        const { config, identity, connection } = this.root
        if (this.root.router.location.pathname == locations.wallet) {
            return undefined
        }
        if (!config.onboarded) {
            return locations.onboarding
        }
        if (!config.currentTermsAgreed) {
            return locations.terms
        }
        if (!identity.identity || !registered(identity.identity)) {
            return locations.onboardingIdentitySetup
        }
        if (connectionInProgress(connection.status)) {
            return locations.connection
        }
        return locations.proposals
    }

    showWelcome = (): void => {
        this.welcome = true
    }

    onboardingFinished = async (): Promise<void> => {
        await this.root.config.setOnboarded()
        this.goHome() // TODO go to account setup
    }

    dismissWelcome = (): void => {
        userEvent(OnboardingAction.GetStarted)
        this.welcome = false
        this.root.router.push(locations.terms)
    }

    showMenu = (show = true): void => {
        this.menu = show
    }

    openChat = (): void => {
        userEvent(OtherAction.SupportChat)
        ipcRenderer.send(MainIpcListenChannels.OpenSupportChat, this.root.identity.identity?.id)
    }

    get isHomeActive(): boolean {
        return this.root.router.location.pathname.includes(locations.consumer)
    }

    get isSettingsActive(): boolean {
        return this.root.router.location.pathname.includes(locations.settings)
    }

    get isHelpActive(): boolean {
        return this.root.router.location.pathname.includes(locations.help)
    }

    get isWalletActive(): boolean {
        return this.root.router.location.pathname.includes(locations.wallet)
    }
}
