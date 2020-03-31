/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { observer } from "mobx-react-lite"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"

import { useStores } from "../../../store"
import { NavBar } from "../../../navbar"
import { textHuge } from "../../../ui-kit/typography"
import { MButton } from "../../../ui-kit/mbutton/mbutton"
import { fixAssetPath } from "../../../utils/paths"
import mosaicBg from "../../../ui-kit/assets/mosaic-bg.png"

export const mystDisplay = (m?: number): string => {
    if (!m) {
        return "0"
    }
    return (m / 100000000).toFixed(3)
}

export const WalletView: React.FC<ViewProps<WidgetEventListeners>> = observer(({ style = "", ...rest }) => {
    const { identity, payment } = useStores()
    const balanceDisplay = mystDisplay(identity.identity?.balance)
    return (
        <View
            style={`
            background: url("${fixAssetPath(mosaicBg)}");
            background-position: center;
            flex-direction: "column";
            ${style}
            `}
            {...rest}
        >
            <NavBar />
            <View
                style={`
                padding-left: 24;
                padding-right: 24;
                flex-direction: "column";
                `}
            >
                <View
                    style={`
                    flex: 1;
                    height: 52;
                    flex-direction: "row";
                    justify-content: "space-between";
                    border-bottom: 1px solid #a04c7d;
                    `}
                >
                    <Text style={`color: #fff;`}>Your identity</Text>
                    <Text style={`color: #fff;`}>{identity.identity?.registrationStatus}</Text>
                    <Text style={`color: #fff;`}>{identity.identity?.id}</Text>
                </View>
                <View
                    style={`
                    flex: 1;
                    padding-top: 24;
                    padding-bottom: 24;
                    height: 104;
                    flex-direction: "column";
                    justify-content: "space-between";
                    `}
                >
                    <Text style={`color: #fff;`}>Available balance</Text>
                    <Text style={`${textHuge} color: #fff;`}>{balanceDisplay} MYSTT</Text>
                </View>
                <View
                    style={`
                    flex: 1;
                    height: 40;
                    flex-direction: "row";
                    justify-content: "center";
                    align-items: "center";
                    background: #2a154d;
                    border-radius: 4;
                    `}
                >
                    <Text style={`color: #fff;`}>
                        MYSTT is a test token which you get for free while we are in the Testnet environment.
                    </Text>
                </View>
                <View style={`padding-top: 12;`}>
                    <MButton text="Topup" cancelStyle onClick={(): Promise<void> => payment.topUp()} />
                </View>
            </View>
        </View>
    )
})
