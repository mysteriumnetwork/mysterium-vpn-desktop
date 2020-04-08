/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"
import { Button, Text, useEventHandler, View } from "@nodegui/react-nodegui"
import React from "react"
import { observer } from "mobx-react-lite"
import { QApplication, QClipboardMode } from "@nodegui/nodegui"

import { Space } from "../../../ui-kit/space/space"
import { fontMono } from "../../../ui-kit/typography"
import { QR } from "../../../ui-kit/qr/qr"
import { useStores } from "../../../store"

export const TopupInstructions: React.FC<ViewProps<WidgetEventListeners>> = observer(({ style = "", ...rest }) => {
    const { identity } = useStores()
    const copyChannelAddressHandler = useEventHandler(
        {
            ["clicked"]: () => {
                if (!identity.identity?.channelAddress) {
                    return
                }
                const clipboard = QApplication.clipboard()
                clipboard.setText(identity.identity?.channelAddress, QClipboardMode.Clipboard)
            },
        },
        [],
    )
    return (
        <View
            style={`
                flex-direction: "row";
                justify-content: "space-between";
                padding-left: 32;
                padding-right: 16;
                ${style}
                `}
            {...rest}
        >
            <View
                style={`
                    flex-direction: "column";
                    `}
            >
                <Space y={48} />
                {identity.identity ? (
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
                            <Button text="Copy" on={copyChannelAddressHandler} />
                        </View>

                        <Text style={`color: "red"; height: 20;`}>{`THIS IS DONE AUTOMATICALLY IN TESTNET.`}</Text>
                        <Text style={`color: "red"; height: 20;`}>{`SIT BACK AND RELAX.`}</Text>
                        <Text style={`height: 20;`}>{`Status: ${identity.identity.registrationStatus}`}</Text>
                        <Space y={24} />
                    </>
                ) : (
                    <></>
                )}
            </View>
            <View style={`padding-top: 32;`}>
                {identity.identity?.channelAddress && <QR text={identity.identity?.channelAddress} size={150} />}
            </View>
        </View>
    )
})
