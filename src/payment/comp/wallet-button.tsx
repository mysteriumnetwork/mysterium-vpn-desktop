/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { Text } from "@nodegui/react-nodegui"

import { useStores } from "../../store"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { brandDarker } from "../../ui-kit/colors"

export const mystDisplay = (m?: number): string => {
    if (!m) {
        return "0"
    }
    return (m / 100000000).toFixed(3)
}

export const WalletButton: React.FC = observer(() => {
    const root = useStores()
    const { identity } = root
    const balance = mystDisplay(identity.identity?.balance)
    const active = root.wallet
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
             justify-content: "space-between";
             padding: 2;
             padding-left: 12;
             padding-right: 8;
             border-radius: 4;
             ${backgroundStyle}
             `}
            onToggle={(): void => {
                root.navigateToWallet()
            }}
        >
            <Text style={textStyle}>Wallet</Text>
            <Text
                style={`
                width: 95;
                ${textStyle}
                qproperty-alignment: 'AlignRight | AlignVCenter';
                `}
            >
                {balance} Ⓜ
            </Text>
        </Toggle>
    )
})
