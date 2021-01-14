/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled, { keyframes } from "styled-components"

import { useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import welcomeBg from "../../../ui-kit/assets/welcome-bg.png"

const Container = styled.div`
    background: url(${welcomeBg}) no-repeat, #8e3061;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
    width: 300px;
    margin: 16px auto 28px auto;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.75px;
    color: #fff;
    animation: ${fadeIn} 0.4s ease-in-out;
`

const GetStartedButton = styled(BrandButton)`
    min-width: 134px;
    margin: 0 auto;
    box-shadow: inset 0 0.5px 1px #ff25a1, 2px 2px 3px rgba(0, 0, 0, 0.3);
`

export const WelcomeView: React.FC = observer(() => {
    const { navigation } = useStores()
    return (
        <Container>
            <Title>Welcome to Mysterium Network</Title>
            <Description>Connect to everything, everywhere via the Worldߴs first decentralized VPN.</Description>
            <GetStartedButton
                onClick={(): void => {
                    navigation.dismissWelcome()
                }}
            >
                Get Started
            </GetStartedButton>
        </Container>
    )
})
