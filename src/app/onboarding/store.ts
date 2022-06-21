/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, makeObservable } from "mobx"

import { RootStore, Step } from "../store"
import { locations } from "../navigation/locations"
import { log } from "../../shared/log/log"

export class OnboardingStore {
    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            onboardingStepsComplete: action,
            createNewID: action,
            registerWithReferralCode: action,
            finishIDSetup: action,
        })
        this.root = root
    }

    onboardingStepsComplete = (): void => {
        this.root.config.setOnboarded()
        this.root.startupSequence(Step.ONBOARDING_STEPS_DONE)
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
        await this.root.identity.register(id, code)
    }

    finishIDSetup = (): void => {
        this.root.startupSequence(Step.IDENTITY_CREATE_DONE)
    }
}
