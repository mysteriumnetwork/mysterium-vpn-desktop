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
                <Route exact path={locations.onboarding3.path}>
                    <Container>
                        <Steps>
                            <StepProgressBar step={2} />
                        </Steps>
                        <Title>Surf the web, and pay as you go</Title>
                        <Animation>
                            <Lottie
                                play
                                loop
                                animationData={animationPayAsYouGo}
                                style={{ width: 256, height: 256 }}
                                renderer="svg"
                            />
                        </Animation>
                        <Subtitle>No lock in subscriptions</Subtitle>
                        <Description>
                            Using our micropayments system, Hermes Protocol, you only pay for the gigabytes you actually
                            use.
                            <br />
                            No subscriptions, no monthly fees – just minute-by-minute payments.
                        </Description>
                        <Actions>
                            <BackButton onClick={() => router.history?.goBack()}>Back</BackButton>
                            <NextButton
                                onClick={(): void => {
                                    router.push(locations.onboarding4)
                                }}
                            >
                                Next
                            </NextButton>
                        </Actions>
                        <SkipContainer>
                            <GhostButton onClick={handleSkip}>Skip</GhostButton>
                        </SkipContainer>
                    </Container>
                </Route>
                <Route exact path={locations.onboarding4.path}>
                    <Container>
                        <Steps>
                            <StepProgressBar step={3} />
                        </Steps>
                        <Title>Top up with popular cryptocurrencies</Title>
                        <Animation>
                            <Lottie
                                play
                                loop
                                animationData={animationPayAsYouGo}
                                style={{ width: 256, height: 256 }}
                                renderer="svg"
                            />
                        </Animation>
                        <Subtitle>BTC, ETH, LTC, BTH and more</Subtitle>
                        <Description>
                            Top up your account now or do it later and use limited functionality and free nodes
                        </Description>
                        <Actions>
                            <BackButton onClick={() => router.history?.goBack()}>Back</BackButton>
                            <NextButton onClick={handleFinish}>Setup my account</NextButton>
                        </Actions>
                        <SkipContainer />
                    </Container>
                </Route>
                <Redirect to={locations.onboardingWelcome.path} />
            </Switch>
        </>
    )
})
