/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { winSize } from "./config"
import { observer } from "mobx-react-lite"
import { useStores } from "./store"
import { Country } from "./ui-kit/country/country"
import { ConnectionStatus as ConnectionStatusType } from "mysterium-vpn-js/lib/connection/status"
import { ConnectDisconnectButton } from "./connection/comp/connect-disconnect-button"
import { textHuge, textLarger, textSmall } from "./ui-kit/typography"
import logoWhiteConnected from "../assets/logo-white-connected.png"
import { fixAssetPath } from "./utils/paths"

export const ConnectionActiveView: React.FC = observer(() => {
    const {
        connection: { location, originalLocation, status },
    } = useStores()
    let statusText = ""
    switch (status) {
        case ConnectionStatusType.CONNECTED:
            statusText = "🔐 Your connection is secure"
            break
        case ConnectionStatusType.NOT_CONNECTED:
            statusText = "⚠️ Your connection is unprotected"
            break
        default:
            statusText = "Working on it..."
    }
    return (
        <View
            // background: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:0 #7c2463, stop:1 #552462);
            style={`
                width: ${winSize.width};
                height: ${winSize.height};
                flex-direction: "column";
                background: url("assets/bg-2.png");
                background-position: center;
            `}
        >
            <View
                style={`
                padding: 32;
                padding-bottom: 0;
                justify-content: "center";
                `}
            >
                <Text
                    style={`
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
                padding-top: 45;
                justify-content: "center";
                `}
            >
                <ConnectDisconnectButton width={200} height={40} />
            </View>
            <View
                style={`
                flex-direction: "column";
                `}
            >
                <Text
                    style={`
                    ${textSmall}
                    color: #fff;
                    `}
                >
                    External IP
                </Text>
                <Text
                    style={`
                    ${textLarger}
                    color: #fff;
                    `}
                >
                    {location?.ip ?? "Updating..."}
                </Text>
            </View>
        </View>
    )
})
