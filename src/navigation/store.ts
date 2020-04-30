/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable, reaction } from "mobx"
import { History, LocationState } from "history"
import { ConnectionStatus, IdentityRegistrationStatus } from "mysterium-vpn-js"

import { RootStore } from "../store"
import { analytics } from "../analytics/analytics-ui"
import { Category, OnboardingAction } from "../analytics/analytics"

import { history } from "./history"
import { locations } from "./locations"

const connectionInProgress = (status: ConnectionStatus): boolean => {
    return [ConnectionStatus.CONNECTED, ConnectionStatus.CONNECTING, ConnectionStatus.DISCONNECTING].includes(status)
}

export class NavigationStore {
    history: History<LocationState>

    @observable
    consumer = true
    @observable
    welcome = true

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        this.history = history
    }

    setupReactions(): void {
        reaction(() => this.root.connection.status, this.determineRoute)
        reaction(() => this.root.identity.identity?.registrationStatus, this.determineRoute)
    }

    @action
    showLoading = (): void => {
        this.navigateTo(locations.loading)
    }

    @action
    navigateTo = (path: string): void => {
        analytics.pageview(path)
        this.history.push(path)
    }

    @action
    determineRoute = (): void => {
        const newLocation = this.determineLocation()
        if (newLocation && this.history.location.pathname !== newLocation) {
            this.navigateTo(newLocation)
        }
    }

    determineLocation = (): string | undefined => {
        const { config, identity, connection } = this.root
        if (this.history.location.pathname == locations.wallet) {
            return undefined
        }
        if (!config.currentTermsAgreed() && this.welcome) {
            return locations.welcome
        } else if (!config.currentTermsAgreed()) {
            return locations.terms
        } else if (
            !identity.identity ||
            identity.identity.registrationStatus !== IdentityRegistrationStatus.RegisteredConsumer
        ) {
            return locations.identity
        } else if (connectionInProgress(connection.status)) {
            return locations.connection
        } else {
            return locations.proposals
        }
    }

    @action
    showWelcome = (): void => {
        this.welcome = true
    }

    @action
    dismissWelcome = (): void => {
        analytics.event(Category.Onboarding, OnboardingAction.GetStarted)
        this.welcome = false
        this.navigateTo(locations.terms)
    }
}
