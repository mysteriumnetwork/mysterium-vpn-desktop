/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../store"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { Text } from "@nodegui/react-nodegui"
import { brandDarker } from "../../ui-kit/colors"

export const mystDisplay = (m?: number): string => {
    if (!m) {
        return "0"
    }
    return (m / 100000000).toFixed(3)
}

export const WalletButton: React.FC = observer(() => {
    const { identity } = useStores()
    const balance = mystDisplay(identity.identity?.balance)
    return (
        <Toggle
            id="togglez"
            style={`
             width: 168;
             height: 24;
             flex-direction: "row";
             justify-content: "space-between";
             padding: 2;
             padding-left: 12;
             padding-right: 8;
             border: 1px solid #c1c1c1;
             border-radius: 4;
             background: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:0 #fefefe, stop:1 #f2f2f2);
             `}
        >
            <Text>Wallet</Text>
            <Text
                style={`
                width: 95;
                color: ${brandDarker};
                qproperty-alignment: 'AlignRight';
                `}
            >
                {balance} Ⓜ
            </Text>
        </Toggle>
    )
})
