/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"

import { brand } from "../../../ui-kit/colors"
import { textHuge, textSmall } from "../../../ui-kit/typography"
import { Space } from "../../../ui-kit/space/space"
import { Spinner } from "../../../ui-kit/spinner/spinner"
import { fixAssetPath } from "../../../utils/paths"

import identityBg from "./identity-bg.png"
import { TopupInstructions } from "./topup-instructions"

export const SelectIdentityView: React.FC<ViewProps<WidgetEventListeners>> = ({ style, ...rest }) => {
    return (
        <View
            style={`
            background: url("${fixAssetPath(identityBg)}") #fff;
            background-repeat: none;
            flex-direction: "column";
            ${style}
            `}
            {...rest}
        >
            <Space y={32} />
            <View
                style={`
                padding-left: 32;
                padding-right: 32;
                height: 28;
                `}
            >
                <Text
                    style={`
                    ${textHuge};
                    color: "${brand}";
                    `}
                >
                    Activate account
                </Text>
            </View>
            <TopupInstructions style={`height: 372;`} />
            <Space y={48} />
            <View
                style={`
                height: 72;
                flex-direction: "row";
                align-items: "center";
                `}
            >
                <Space x={350} />
                <Spinner
                    style={`
                    `}
                />
                <Space x={10} />
                <View
                    style={`
                    flex-direction: "column";
                    `}
                >
                    <Text style={`font-weight: bold; color: #4d4d4d;`}>Waiting for transfer</Text>
                    <Text style={`${textSmall} color: #808080;`}>Automatically scanning blockchain...</Text>
                </View>
            </View>
        </View>
    )
}
