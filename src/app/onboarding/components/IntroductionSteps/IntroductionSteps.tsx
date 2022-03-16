/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Lottie from "react-lottie-player"
import React from "react"
import styled, { keyframes } from "styled-components"

import { StepProgressBar } from "../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { GhostButton } from "../../../ui-kit/components/Button/GhostButton"
import { bg1 } from "../../../ui-kit/colors"
import { Heading2, Small } from "../../../ui-kit/typography"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"

const Container = styled(ViewContainer)`
    background: ${bg1};
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

export interface IntroductionStepProps {
    index: number
    title: React.ReactNode
    subtitle: React.ReactNode
    description: React.ReactNode
    animation: object
    onBack?: () => void
    nextText?: React.ReactNode
    onNext?: () => void
    onSkip?: () => void
}

export const IntroductionStep: React.FC<IntroductionStepProps> = (props) => (
    <Container>
        <Steps>
            <StepProgressBar step={props.index} />
        </Steps>
        <Title>{props.title}</Title>
        <Animation>
            <Lottie play loop animationData={props.animation} style={{ width: 256, height: 256 }} renderer="svg" />
        </Animation>
        <Subtitle>{props.subtitle}</Subtitle>
        <Description>{props.description}</Description>
        <Actions>
            {!!props.onBack && <BackButton onClick={props.onBack}>Back</BackButton>}
            {!!props.onNext && <NextButton onClick={props.onNext}>{props.nextText ?? "Next"}</NextButton>}
        </Actions>
        <SkipContainer>{!!props.onSkip && <GhostButton onClick={props.onSkip}>Skip</GhostButton>}</SkipContainer>
    </Container>
)
