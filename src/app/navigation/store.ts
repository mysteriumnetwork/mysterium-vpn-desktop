/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable } from "mobx"
import { ConnectionStatus, IdentityRegistrationStatus } from "mysterium-vpn-js"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { MainIpcListenChannels } from "../../shared/ipc"
import { connectionInProgress } from "../connection/status"

import { locations } from "./locations"

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
            navigateToInitialRoute: action,
            navigateOnConnectionStatus: action,
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

    navigateToInitialRoute = (): void => {
        const newLocation = this.determineInitialLocation()
        if (newLocation) {
            this.root.router.push(newLocation)
        }
    }

    determineInitialLocation = (): string | undefined => {
        const { config, identity } = this.root
        if (this.root.router.location.pathname == locations.wallet) {
            return undefined
        }
        if (!config.onboarded) {
            return locations.onboarding
        }
        if (!config.currentTermsAgreed) {
            return locations.terms
        }
        if (!identity.identity) {
            return locations.onboardingIdentitySetup
        }
        switch (identity.identity.registrationStatus) {
            case IdentityRegistrationStatus.Unknown:
                return undefined // Do nothing (leave loading)
            case IdentityRegistrationStatus.InProgress:
                return locations.registering
            case IdentityRegistrationStatus.Unregistered:
            case IdentityRegistrationStatus.RegistrationError:
                return locations.onboardingTopupPrompt
        }
        return locations.proposals
    }

    navigateOnConnectionStatus = (status: ConnectionStatus): void => {
        if (!this.root.router.location.pathname.includes(locations.consumer)) {
            return
        }
        if (connectionInProgress(status)) {
            this.root.router.push(locations.connection)
        } else {
            this.root.router.push(locations.proposals)
        }
    }

    openChat = (): void => {
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
