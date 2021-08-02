/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { Redirect, Route, Switch } from "react-router-dom"

import { locations } from "../../../navigation/locations"
import { IntroductionSteps } from "../../../onboarding/components/IntroductionSteps/IntroductionSteps"
import { Welcome } from "../../../onboarding/components/Welcome/Welcome"
import { IdentitySetup } from "../../../onboarding/components/IdentitySetup/IdentitySetup"
import { IdentityBackup } from "../../../onboarding/components/IdentityBackup/IdentityBackup"

export const OnboardingView: React.FC = observer(() => {
    return (
        <>
            <Switch>
                <Route exact path={locations.onboardingWelcome.path}>
                    <Welcome />
                </Route>
                <Route path={locations.onboardingIntro.path}>
                    <IntroductionSteps />
                </Route>
                <Route exact path={locations.onboardingIdentitySetup.path}>
                    <IdentitySetup />
                </Route>
                <Route exact path={locations.onboardingIdentityBackup.path}>
                    <IdentityBackup />
                </Route>
                <Redirect to={locations.onboardingWelcome.path} />
            </Switch>
        </>
    )
})
