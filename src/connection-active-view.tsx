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
import * as _ from "lodash"
import { ConnectionStatus } from "mysterium-vpn-js"
import { winSize } from "./config"
import { useStores } from "./store"
import { Country } from "./ui-kit/country/country"
import { ConnectDisconnectButton } from "./connection/comp/connect-disconnect-button"
import { textHuge } from "./ui-kit/typography"
import logoWhiteConnected from "../assets/logo-white-connected.png"
import { fixAssetPath } from "./utils/paths"
import { Metric } from "./connection/comp/metric"
import { NavBar } from "./navbar"
import { perGiB, perMinute } from "./payment/rate"

const toClock = (duration: number): string => {
    const secs = Math.floor(duration % 60)
    const mins = Math.floor((duration % (60 * 60)) / 60)
    const hours = Math.floor(duration / (60 * 60))
    return [hours, mins, secs].map(n => _.padStart(String(n), 2, "0")).join(":")
}

export const ConnectionActiveView: React.FC = observer(() => {
    const {
        connection: {
            location,
            originalLocation,
            status,
            statistics: { duration, bytesReceived, bytesSent } = {},
            proposal,
        },
    } = useStores()
    let rate = ""
    if (proposal?.paymentMethod) {
        rate = perMinute(proposal.paymentMethod) + "/min" + " ＋ " + perGiB(proposal.paymentMethod) + "/GiB"
    }
    const clock = duration ? toClock(duration) : ""
    const down = bytesReceived ? byteSize(bytesReceived, { units: "iec" }) : ""
    const up = bytesSent ? byteSize(bytesSent, { units: "iec" }) : ""
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
                <View
                    style={`
                    padding-left: 80;
                    flex-direction: "column";
                    `}
                >
                    <View
                        style={`
                        padding-bottom: 14;
                        flex-direction: "row";
                        `}
                    >
                        <Text
                            style={`
                            color: #c0b3c9;
                            width: 120;
                            `}
                        >
                            Provider ID
                        </Text>
                        <Text style={`color: #c0b3c9;`}>{proposal?.providerId ?? ""}</Text>
                    </View>
                    <View
                        style={`
                        padding-bottom: 14;
                        flex-direction: "row";
                        `}
                    >
                        <Text
                            style={`
                            color: #c0b3c9;
                            width: 120;
                            `}
                        >
                            Price
                        </Text>
                        <Text style={`color: #c0b3c9;`}>{rate}</Text>
                    </View>
                </View>
                <View
                    style={`
                    padding-top: 25;
                    padding-bottom: 24;
                    flex-direction: "row";
                    justify-content: "center";
                    `}
                >
                    <ConnectDisconnectButton width={200} height={40} />
                </View>
                <View
                    style={`
                    width: "100%";
                    top: 53;
                    height: 65;
                    padding: 8;
                    background: #2a154d;
                    flex-direction: "row";
                    justify-content: "space-around";
                    `}
                >
                    <Metric name="Duration" value={clock} style={{ value: textHuge }} />
                    <Metric name="Downloaded" value={down} style={{ value: textHuge }} />
                    <Metric name="Uploaded" value={up} style={{ value: textHuge }} />
                    <Metric name="Paid" value="" style={{ value: textHuge }} />
                </View>
            </View>
        </View>
    )
})
