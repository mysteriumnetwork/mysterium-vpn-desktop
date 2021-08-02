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
            setupMyId: action,
            createNewId: action,
            identityProgress: observable,
            setIdentityProgress: action,
            finishIdSetup: action,
            complete: action,
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

    createNewId = async (): Promise<void> => {
        this.setIdentityProgress(IdentityProgress.CREATING)
        await this.root.identity.create()
        this.setIdentityProgress(IdentityProgress.LOADING)
        await this.root.identity.loadIdentity()
        const id = this.root.identity.identity
        if (!id) {
            log.error("ID not found, exiting")
            return
        }
        this.setIdentityProgress(IdentityProgress.REGISTERING)
        await this.root.identity.register(id)
        this.setIdentityProgress(IdentityProgress.COMPLETE)
        this.root.router.push(locations.onboardingIdentityBackup)
    }

    setIdentityProgress = (p: IdentityProgress): void => {
        log.info("Identity creation progress:", p)
        this.identityProgress = p
    }

    finishIdSetup = (): void => {
        this.root.router.push(locations.proposals)
    }

    complete = (): void => {
        this.root.router.push(locations.proposals)
    }
}
