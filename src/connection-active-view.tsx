/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { observer } from "mobx-react-lite"
import byteSize from "byte-size"
import { ConnectionStatus } from "mysterium-vpn-js"
import { winSize } from "./config"
import { useStores } from "./store"
import { Country } from "./ui-kit/country/country"
import { ConnectDisconnectButton } from "./connection/comp/connect-disconnect-button"
import { fontMono, textHuge } from "./ui-kit/typography"
import logoWhiteConnected from "../assets/logo-white-connected.png"
import { fixAssetPath } from "./utils/paths"
import { Metric } from "./connection/comp/metric"

export const ConnectionActiveView: React.FC = observer(() => {
    const {
        connection: { location, originalLocation, status, statistics },
        proposals,
    } = useStores()
    const down = statistics ? byteSize(statistics.bytesReceived, { units: "iec" }) : ""
    const up = statistics ? byteSize(statistics.bytesSent, { units: "iec" }) : ""
    let statusText = ""
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
                padding-bottom: 24;
                justify-content: "center";
                `}
            >
                <ConnectDisconnectButton width={200} height={40} />
            </View>
            <View style={`margin-left: 12; margin-right: 12; height: 1; background: #724e81;`} />
            <View
                style={`
                width: "100%";
                height: 92;
                padding: 24;
                flex-direction: "row";
                justify-content: "space-between";
                `}
            >
                <Metric name="External IP" value={location?.ip} style={{ value: "width: 120;" }} />
                <Metric
                    name="Server ID"
                    value={proposals.active?.id10}
                    style={{
                        value: fontMono,
                    }}
                />
                <Metric name="Price" value="" />
                <Metric name="Quality" value="" />
            </View>
            <View
                style={`
                width: "100%";
                height: 80;
                padding: 8;
                background: #2a154d;
                flex-direction: "row";
                justify-content: "space-around";
                `}
            >
                <Metric name="Duration" value="--:--:--:--" style={{ value: textHuge }} />
                <Metric name="Downloaded" value={down} style={{ value: textHuge }} />
                <Metric name="Uploaded" value={up} style={{ value: textHuge }} />
                <Metric name="Cost" value="- MYST" style={{ value: textHuge }} />
            </View>
        </View>
    )
})
