/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"

import { locations } from "../../../navigation/locations"
import { useStores } from "../../../store"

import { IntroductionStep } from "./IntroductionSteps"
import animationNetwork from "./animation_network.json"

export const Step1: React.FC = observer(function Step1() {
    const { onboarding } = useStores()
    const navigate = useNavigate()
    return (
        <IntroductionStep
            index={0}
            title="Decentralized global node network"
            subtitle="Run by people, for people"
            description="Our network is blind to borders. Select any IP you like from our global list and get unlimited access to worldwide content."
            animation={animationNetwork}
            onNext={() => navigate(locations.onboardingIntro2)}
            onSkip={() => onboarding.onboardingStepsComplete()}
        />
    )
})
