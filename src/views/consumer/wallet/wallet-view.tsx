/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"

export const mystDisplay = (m?: number): string => {
    if (!m) {
        return Number(0).toFixed(3)
    }
    return (m / 100000000).toFixed(3)
}

export const WalletView: React.FC = observer(() => {
    const { identity } = useStores()
    const balanceDisplay = mystDisplay(identity.identity?.balance)
    return (
        <div>{balanceDisplay}</div>
        /*<View
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
                <Space y={24} />
                <View
                    style={`
                    flex: 1;
                    height: 56;
                    flex-direction: "column";
                    justify-content: "space-between";
                    `}
                >
                    <Text style={`color: #fff;`}>Available balance</Text>
                    <Text style={`${textHuge} color: #fff;`}>{balanceDisplay} MYSTT</Text>
                </View>
                <Space y={24} />
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
                <Space y={16} />
                <View>
                    <LightButton text="Topup" onClick={(): Promise<void> => payment.topUp()} />
                </View>
            </View>
        </View>*/
    )
})
