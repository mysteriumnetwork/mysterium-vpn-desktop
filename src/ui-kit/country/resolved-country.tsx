/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text, View } from "@nodegui/react-nodegui"

import { Flag } from "./flag"

export type ResolvedCountryProps = {
    name: string
    flagBase64: Buffer
    containerStyle?: string
    textStyle?: string
    flagStyle?: string
    text?: boolean
}

export const ResolvedCountry: React.FC<ResolvedCountryProps> = ({
    name,
    flagBase64,
    containerStyle = "",
    textStyle = "",
    flagStyle = "",
    text = false,
}) => (
    <View style={`${containerStyle}`}>
        <Flag size={24} imageBase64={flagBase64} style={flagStyle} />
        {text && <Text style={`margin-left: 1; ${textStyle || ""}`}>{name}</Text>}
    </View>
)
