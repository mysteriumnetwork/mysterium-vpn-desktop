/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled, { keyframes } from "styled-components"

import { Step, useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"

import welcomeBg from "./welcome-bg.png"

const Container = styled.div`
    background: url(${welcomeBg}) no-repeat, #8e3061;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    -webkit-app-region: drag;
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
    padding-top: 280px;
    margin: 0;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    letter-spacing: 1px;
    color: #fff;
    animation: ${fadeIn} 0.4s ease-in-out;
`

const Description = styled.p`
    width: 310px;
    margin: 16px auto 28px auto;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.75px;
    color: #fff;
    animation: ${fadeIn} 0.4s ease-in-out;
`

const Actions = styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 57px;
`

const GetStartedButton = styled(BrandButton)`
    min-width: 134px;
    box-shadow: inset 0 0.5px 1px #ff25a1, 2px 2px 3px rgba(0, 0, 0, 0.3);
`

export const Welcome: React.FC = observer(function Welcome() {
    const rootStore = useStores()
    const onGetStarted = () => {
        return rootStore.startupSequence(Step.WELCOME_DONE)
    }
    return (
        <Container>
            <Title>Welcome to Mysterium Network</Title>
            <Description>Connect to everything, everywhere via the Worldߴs first decentralized VPN.</Description>
            <Actions>
                <GetStartedButton onClick={onGetStarted}>Get Started</GetStartedButton>
            </Actions>
        </Container>
    )
})
