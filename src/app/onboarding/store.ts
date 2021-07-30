/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, makeObservable } from "mobx"

import { RootStore } from "../store"
import { locations } from "../navigation/locations"

export class OnboardingStore {
    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            getStarted: action,
            setupMyId: action,
        })
        this.root = root
    }

    getStarted = (): void => {
        this.root.router.push(locations.terms)
    }

    setupMyId = (): void => {
        if (this.root.identity.identityExists) {
            this.root.router.push(locations.onboardingIdentityBackup)
        } else {
            this.root.router.push(locations.onboardingIdentitySetup)
        }
    }
}
