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
import animationPayAsYouGo from "./animation_payasyougo.json"

export const Step3: React.FC = observer(function Step3() {
    const { onboarding } = useStores()
    const navigate = useNavigate()
    return (
        <IntroductionStep
            index={2}
            title="Surf the web, and pay as you go"
            subtitle="No lock in subscriptions"
            description={
                <>
                    Using our micropayments system, Hermes Protocol, you only pay for the gigabytes you actually use.
                    <br />
                    No subscriptions, no monthly fees – just minute-by-minute payments.
                </>
            }
            animation={animationPayAsYouGo}
            onBack={() => navigate(-1)}
            onNext={() => navigate(locations.onboardingIntro4)}
            onSkip={() => onboarding.onboardingStepsComplete()}
        />
    )
})
