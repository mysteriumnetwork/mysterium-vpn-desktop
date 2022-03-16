/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, makeObservable, observable } from "mobx"

import { RootStore } from "../store"
import { locations } from "../navigation/locations"
import { log } from "../../shared/log/log"
import { registered } from "../identity/identity"

enum IdentityProgress {
    NOT_STARTED = "",
    CREATING = "Creating",
    LOADING = "Loading",
    REGISTERING = "Registering",
    COMPLETE = "Complete",
}

export class OnboardingStore {
    root: RootStore

    identityProgress = IdentityProgress.NOT_STARTED

    constructor(root: RootStore) {
        makeObservable(this, {
            getStarted: action,
            setupMyID: action,
            createNewID: action,
            registerWithReferralCode: action,
            identityProgress: observable,
            setIdentityProgress: action,
            finishIDSetup: action,
            complete: action,
        })
        this.root = root
    }

    getStarted = (): void => {
        this.root.navigation.push(locations.terms)
    }

    setupMyID = (): void => {
        if (this.root.identity.identityExists) {
            this.root.navigation.push(locations.onboardingIdentityBackup)
        } else {
            this.root.navigation.push(locations.onboardingIdentitySetup)
        }
    }

    createNewID = async (): Promise<void> => {
        await this.root.identity.create()
        await this.root.identity.loadIdentity()
        const id = this.root.identity.identity
        if (!id) {
            log.error("ID not found, exiting")
            return
        }
        this.root.navigation.push(locations.onboardingIdentityBackup)
    }

    registerWithReferralCode = async (code: string): Promise<void> => {
        const id = this.root.identity.identity
        if (!id) {
            log.error("ID not found, exiting")
            return
        }
        this.setIdentityProgress(IdentityProgress.REGISTERING)
        await this.root.identity.register(id, code)
        this.setIdentityProgress(IdentityProgress.COMPLETE)
    }

    setIdentityProgress = (p: IdentityProgress): void => {
        log.info("Identity creation progress:", p)
        this.identityProgress = p
    }

    finishIDSetup = (): void => {
        this.complete()
        const id = this.root.identity.identity
        if (id && registered(id)) {
            this.root.navigation.goHome()
        } else {
            this.root.navigation.push(locations.onboardingTopupPrompt)
        }
    }

    complete = (): void => {
        this.root.config.setOnboarded()
    }
}
