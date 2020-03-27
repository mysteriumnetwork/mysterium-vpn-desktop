/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { View } from "@nodegui/react-nodegui"
import { winSize } from "./config"
import { WalletButton } from "./payment/comp/wallet-button"

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
            justify-content: "flex-end";
            align-items: "center";
            `}
        >
            <WalletButton />
        </View>
    )
}
