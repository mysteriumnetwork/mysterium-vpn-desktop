/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/mbutton/brand-button"
import welcomeBg from "../../../ui-kit/assets/welcome-bg.png"

const Container = styled.div`
    height: 100%;
    background-image: url(${welcomeBg});
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

const Title = styled.h1`
    padding-top: 280px;
    margin: 0;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    letter-spacing: 1px;
    color: #fff;
`

const Description = styled.p`
    width: 300px;
    margin: 16px auto 28px auto;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.75px;
    color: #fff;
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
    /*    return (
            <View
                style={`
                background: url("${fixAssetPath(welcomeBg)}") #2e265e;
                background-repeat: none;
                flex-direction: "column";
                ${style}
                `}
                {...rest}
            >
                <View style={`height: 280;`} />
                <View style={`width: "100%"; height: 28;`}>
                    <Text
                        style={`
                        flex: 1;
                        color: #fff;
                        qproperty-alignment: AlignHCenter;
                        ${textHuge}
                        font-weight: bold;
                        `}
                    >
                        Welcome to Mysterium Network
                    </Text>
                </View>
                <View style={`height: 16;`} />
                <View
                    style={`
                    width: "100%";
                    height: 48;
                    flex-direction: "column";
                    `}
                >
                    <Text
                        style={`
                        flex: 1;
                        color: #fff;
                        ${textLarger}
                        qproperty-alignment: AlignHCenter;
                        `}
                    >
                        {`Connect to everything, everywhere via `}
                    </Text>
                    <Text
                        style={`
                        flex: 1;
                        color: #fff;
                        ${textLarger}
                        qproperty-alignment: AlignHCenter;
                        `}
                    >{`the World's 1st decentralized VPN.`}</Text>
                </View>
                <View style={`height: 28;`} />
                <View
                    style={`
                    width: "100%";
                    height: 40;
                    flex-direction: "row";
                    justify-content: "center";
                    `}
                >
                    <BrandButton
                        text="Get Started"
                        onClick={(): void => {
                            root.dismissWelcome()
                        }}
                    />
                </View>
            </View>*/
})
