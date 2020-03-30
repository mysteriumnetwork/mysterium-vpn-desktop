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

export const WalletView: React.FC<ViewProps<WidgetEventListeners>> = observer(({ style = "", ...rest }) => {
    const { identity } = useStores()
    return (
        <View
            style={`
            background: url("assets/bg-2.png");
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
            </View>
        </View>
    )
})
