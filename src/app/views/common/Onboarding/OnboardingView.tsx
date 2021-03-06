/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { Redirect, Route, Switch } from "react-router-dom"
import styled, { keyframes } from "styled-components"
import Lottie from "react-lottie-player"

import { locations } from "../../../navigation/locations"
import { bg1 } from "../../../ui-kit/colors"
import { Heading2, Small } from "../../../ui-kit/typography"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { StepProgressBar } from "../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { GhostButton } from "../../../ui-kit/components/Button/GhostButton"
import { useStores } from "../../../store"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"

import { OnboardingWelcome } from "./OnboardingWelcome"
import animationNetwork from "./animation_network.json"
import animationPayAsYouGo from "./animation_payasyougo.json"

const Container = styled.div`
    background: ${bg1};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    -webkit-app-region: drag;
`

const Steps = styled.div`
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const Title = styled.h1`
    margin: 0;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    letter-spacing: 1px;
    color: #fff;
    animation: ${fadeIn} 0.4s ease-in-out;
`

const Animation = styled.div`
    background: #f4f4fc11;
    border-radius: 50%;
    width: 256px;
    height: 256px;
    margin: 0 auto;
    margin-top: 17px;
`

const Subtitle = styled(Heading2)`
    margin-top: 18px;
    text-align: center;
    color: #fff;
    animation: ${fadeIn} 0.4s ease-in-out;
`

const Description = styled(Small)`
    height: 56px;
    color: #fff;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 50px;
`

const Actions = styled.div`
    height: 35px;
    margin-top: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const BackButton = styled(LightButton)`
    margin-right: 20px;
`

const NextButton = styled(BrandButton)`
    min-width: 134px;
    box-shadow: inset 0 0.5px 1px #ff25a1, 2px 2px 3px rgba(0, 0, 0, 0.3);
`

const SkipContainer = styled.div`
    height: 57px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const OnboardingView: React.FC = observer(() => {
    const { router, navigation } = useStores()
    const handleSkip = () => navigation.skipOnboarding()
    const handleFinish = () => navigation.onboardingFinished()
    return (
        <>
            <Switch>
                <Route exact path={locations.onboardingWelcome.path}>
                    <OnboardingWelcome />
                </Route>
                <Route exact path={locations.onboarding1.path}>
                    <Container>
                        <Steps>
                            <StepProgressBar step={0} />
                        </Steps>
                        <Title>Decentralized global node network</Title>
                        <Animation>
                            <Lottie
                                play
                                loop
                                animationData={animationNetwork}
                                style={{ width: 256, height: 256 }}
                                renderer="svg"
                            />
                        </Animation>
                        <Subtitle>Run by people, for people</Subtitle>
                        <Description>
                            Our network is blind to borders. Select any IP you like from our global list and get
                            unlimited access to worldwide content.
                        </Description>
                        <Actions>
                            <NextButton
                                onClick={(): void => {
                                    router.push(locations.onboarding2)
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
                <Route exact path={locations.onboarding2.path}>
                    <Container>
                        <Steps>
                            <StepProgressBar step={1} />
                        </Steps>
                        <Title>Privacy first</Title>
                        <Animation />
                        <Subtitle>Distributed infrastructure, decentralised logs</Subtitle>
                        <Description>
                            Now everyone says no logs, but do they mean no logs? Don&apos;t trust. Verify.
                        </Description>
                        <Actions>
                            <BackButton onClick={() => router.history?.goBack()}>Back</BackButton>
                            <NextButton
                                onClick={(): void => {
                                    router.push(locations.onboarding3)
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
