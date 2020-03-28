/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { observer } from "mobx-react-lite"
import { ConnectionStatus } from "mysterium-vpn-js"

import { winSize } from "../../../config"
import { useStores } from "../../../store"
import { Country } from "../../../ui-kit/country/country"
import { ConnectDisconnectButton } from "../../../connection/comp/connect-disconnect-button"
import { textHuge } from "../../../ui-kit/typography"
import logoWhiteConnected from "../../../../assets/logo-white-connected.png"
import { fixAssetPath } from "../../../utils/paths"
import { NavBar } from "../../../navbar"

import { ConnectionStatistics } from "./connection-statistics"
import { ConnectionProposal } from "./connection-proposal"

export const ConnectedView: React.FC = observer(() => {
    const {
        connection: { location, originalLocation, status },
    } = useStores()
    let statusText: string
    switch (status) {
        case ConnectionStatus.CONNECTING:
            statusText = "Connecting..."
            break
        case ConnectionStatus.CONNECTED:
            statusText = "Your connection is secure"
            break
        case ConnectionStatus.DISCONNECTING:
            statusText = "Disconnecting..."
            break
        case ConnectionStatus.NOT_CONNECTED:
            statusText = "Your connection is unprotected"
            break
        default:
            statusText = "Working on it..."
    }
    return (
        <View
            style={`
            width: ${winSize.width};
            height: ${winSize.height};
            flex-direction: "column";
            `}
        >
            <NavBar />
            <View
                style={`
                width: ${winSize.width};
                height: ${winSize.height - 40};
                flex-direction: "column";
                background: url("assets/bg-2.png");
                background-position: center;
            `}
            >
                <View
                    style={`
                width: "100%";
                padding: 32;
                padding-bottom: 0;
                `}
                >
                    <Text
                        style={`
                        width: "100%";
                        ${textHuge}
                        color: #fff;
                        font-weight: 100;
                        qproperty-alignment: 'AlignHCenter';
                        `}
                    >
                        {statusText}
                    </Text>
                </View>
                <View
                    style={`
                padding: 60;
                padding-bottom: 0;
                `}
                >
                    <View
                        style={`
                    width: "100%";
                    height: 108;
                    background: url("${fixAssetPath(logoWhiteConnected)}");
                    background-position: top center;
                    background-repeat: none;
                    `}
                    />
                </View>
                <View
                    style={`
                    top: -65;
                    flex-direction: "row";
                    `}
                >
                    <View
                        style={`
                        left: 104;
                        `}
                    >
                        <Country code={originalLocation?.country} text={false} />
                    </View>
                    <View
                        style={`
                        left: 488;
                        `}
                    >
                        <Country code={location?.country} text={false} />
                    </View>
                </View>
                <View
                    style={`
                top: -30;
                left: 470;
                width: 110;
                height: 20;
                `}
                >
                    <Text
                        style={`
                    width: "100%";
                    color: #fff;
                    qproperty-alignment: AlignHCenter;
                    `}
                    >
                        {location?.ip}
                    </Text>
                </View>
                <ConnectionProposal
                    style={`
                    padding-left: 80;
                    flex-direction: "column";
                    `}
                />
                <View
                    style={`
                    padding-top: 35;
                    padding-bottom: 24;
                    flex-direction: "row";
                    justify-content: "center";
                    `}
                >
                    <ConnectDisconnectButton width={200} height={40} />
                </View>
                <ConnectionStatistics
                    style={`
                    width: "100%";
                    top: 22;
                    height: 65;
                    padding: 8;
                    background: #2a154d;
                    flex-direction: "row";
                    justify-content: "space-around";
                    `}
                />
            </View>
        </View>
    )
})
