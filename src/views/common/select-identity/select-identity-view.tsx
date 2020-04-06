/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Button, Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { observer } from "mobx-react-lite"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"

import { useStores } from "../../../store"
import { brand } from "../../../ui-kit/colors"
import { fontMono, textHuge, textSmall } from "../../../ui-kit/typography"
import { Space } from "../../../ui-kit/space/space"
import { Spinner } from "../../../ui-kit/spinner/spinner"
import { fixAssetPath } from "../../../utils/paths"

import identityBg from "./identity-bg.png"

export const SelectIdentityView: React.FC<ViewProps<WidgetEventListeners>> = observer(({ style, ...rest }) => {
    const { identity } = useStores()
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
            <Space y={48} />
            <View
                style={`
                height: 372;
                flex-direction: "column";
                padding-left: 32;
                padding-right: 32;
                `}
            >
                {identity.identity && (
                    <>
                        <Text style={`height: 20;`}>To activate your account and top up 100 MYST, transfer ... to</Text>
                        <View
                            style={`
                            height: 42;
                            flex-direction: "row";
                            `}
                        >
                            <Text
                                style={`
                                height: 42;
                                font-size: 13px;
                                font-weight: bold;
                                ${fontMono}
                                `}
                            >
                                {identity.identity.channelAddress}
                            </Text>
                            <Space x={12} />
                            <Button text="Copy" />
                        </View>

                        <Text style={`color: "red"; height: 20;`}>{`THIS IS DONE AUTOMATICALLY IN TESTNET.`}</Text>
                        <Text style={`color: "red"; height: 20;`}>{`SIT BACK AND RELAX.`}</Text>
                        <Text style={`height: 20;`}>{`Status: ${identity.identity.registrationStatus}`}</Text>
                        <Space y={24} />
                    </>
                )}
            </View>
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
})
