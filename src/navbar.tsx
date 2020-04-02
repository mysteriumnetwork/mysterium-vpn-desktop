/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"

import { winSize } from "./config"
import { WalletButton } from "./payment/comp/wallet-button"
import { useStores } from "./store"
import { Toggle } from "./ui-kit/toggle/toggle"
import { brandDarker } from "./ui-kit/colors"

export const ConsumerModeButton: React.FC = observer(() => {
    const root = useStores()
    const active = root.consumer
    const backgroundStyle = active
        ? "background: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:0 #873a72, stop:1 #673a72);"
        : "background: #fff;"
    const textStyle = active ? "color: #fff;" : `color: ${brandDarker};`
    return (
        <Toggle
            style={`
             width: 168;
             height: 26;
             flex-direction: "row";
             justify-content: "center";
             padding: 2;
             padding-left: 12;
             padding-right: 8;
             border-radius: 4;
             ${backgroundStyle}
             `}
            onToggle={(): void => {
                root.navigateToConsumer()
            }}
        >
            <Text style={textStyle}>Connect to VPN</Text>
        </Toggle>
    )
})

export const NavBar: React.FC = () => {
    return (
        <View
            style={`
            width: ${winSize.width};
            height: 40;
            padding-top: 8;
            padding-bottom: 8;
            padding-left: 16;
            padding-right: 16;
            background: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:0 #d6d6d6, stop:0.97 #ccc, stop:1 #bababa);
            flex-direction: "row";
            justify-content: "space-between";
            align-items: "center";
            `}
        >
            <ConsumerModeButton />
            <WalletButton />
        </View>
    )
}
