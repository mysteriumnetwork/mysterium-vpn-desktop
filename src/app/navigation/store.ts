/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable } from "mobx"
import { ConnectionStatus, IdentityRegistrationStatus } from "mysterium-vpn-js"
import { ipcRenderer } from "electron"
import { History, Location } from "history"

import { RootStore } from "../store"
import { MainIpcListenChannels } from "../../shared/ipc"
import { connectionInProgress } from "../connection/status"
import { log } from "../../shared/log/log"

import { locations } from "./locations"

export class NavigationStore {
    root: RootStore
    history: History

    constructor(root: RootStore, history: History) {
        makeObservable(this, {
            location: computed,
            showLoading: action,
            goHome: action,
            navigateToInitialRoute: action,
            navigateOnConnectionStatus: action,
            openChat: action,
        })
        this.root = root
        this.history = history
    }

    push = (path: string): void => {
        log.debug("Navigating ->", path)
        this.history?.push(path)
    }

    get location(): Location {
        return this.history.location
    }

    showLoading = (): void => {
        this.push(locations.loading)
    }

    goHome = (): void => {
        if (connectionInProgress(this.root.connection.status)) {
            this.push(locations.connection)
            return
        }
        if (!this.root.config.quickConnect) {
            this.push(locations.proposalsManualConnect)
        } else {
            this.push(locations.proposalsQuickConnect)
        }
    }

    navigateToInitialRoute = (): void => {
        const newLocation = this.determineInitialLocation()
        if (newLocation) {
            this.push(newLocation)
        }
    }

    determineInitialLocation = (): string | undefined => {
        const { config, identity, connection } = this.root
        if (connectionInProgress(connection.status)) {
            return locations.connection
        }
        if (this.location.pathname == locations.wallet) {
            return undefined
        }
        if (!config.onboarded) {
            return locations.onboardingWelcome
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
                return locations.idRegistering
            case IdentityRegistrationStatus.Unregistered:
            case IdentityRegistrationStatus.RegistrationError:
                return locations.onboardingTopupPrompt
        }
        // Proposals view
        if (!this.root.config.quickConnect) {
            return locations.proposalsManualConnect
        }
        return locations.proposalsQuickConnect
    }

    navigateOnConnectionStatus = (status: ConnectionStatus): void => {
        const isHomeActive = this.location.pathname.includes(locations.consumer)
        if (!isHomeActive) {
            // Do not change location if user is not in the home (consumer) view:
            // he might be viewing settings or wallet
            return
        }
        if (connectionInProgress(status)) {
            this.push(locations.connection)
        } else {
            this.push(locations.proposals)
        }
    }

    openChat = (): void => {
        ipcRenderer.send(MainIpcListenChannels.OpenSupportChat, this.root.identity.identity?.id)
    }
}
