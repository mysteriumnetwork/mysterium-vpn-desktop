/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"

import { IntroductionStep } from "./IntroductionSteps"
import animationCrypto from "./animation_crypto.json"

export const Step4: React.FC = observer(function Step4() {
    const { onboarding } = useStores()
    const navigate = useNavigate()
    return (
        <IntroductionStep
            index={3}
            title="Top up with popular cryptocurrencies"
            subtitle="BTC, ETH, LTC, BCH and more"
            description="Top up your account now or do it later and use limited functionality and free nodes"
            animation={animationCrypto}
            onBack={() => navigate(-1)}
            nextText="Setup my account"
            onNext={() => onboarding.onboardingStepsComplete()}
        />
    )
})
