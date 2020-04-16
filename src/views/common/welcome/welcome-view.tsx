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
    background-position: top -22px left 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

export const WelcomeView: React.FC = observer(() => {
    const { navigation } = useStores()
    return (
        <Container>
            <BrandButton
                text="Get Started"
                onClick={(): void => {
                    navigation.dismissWelcome()
                }}
            />
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
