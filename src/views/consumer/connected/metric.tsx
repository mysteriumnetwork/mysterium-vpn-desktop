/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text, View } from "@nodegui/react-nodegui"

import { textHuge, textSmall } from "../../../ui-kit/typography"

export type MetricProps = {
    name: string
    value?: string
}

export const Metric: React.FC<MetricProps> = ({ name, value = "" }) => {
    return (
        <View
            style={`
            flex-direction: "column";
            justify-content: "space-between";
            min-width: 120;
            `}
        >
            <Text
                style={`
                ${textSmall}
                color: #c0b3c9;
                `}
            >
                {name}
            </Text>
            <Text
                style={`
                ${textHuge}
                color: #fff;
                `}
            >
                {value}
            </Text>
        </View>
    )
}
