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
import animationPrivacy from "./animation_privacy.json"

export const Step2: React.FC = observer(function Step2() {
    const { onboarding } = useStores()
    const navigate = useNavigate()
    return (
        <IntroductionStep
            index={1}
            title="Privacy first"
            subtitle="Distributed infrastructure, decentralised logs"
            description={<>Now everyone says no logs, but do they mean no logs? Don&apos;t trust. Verify.</>}
            animation={animationPrivacy}
            onBack={() => navigate(-1)}
            onNext={() => navigate(locations.onboardingIntro3)}
            onSkip={() => onboarding.onboardingStepsComplete()}
        />
    )
})
