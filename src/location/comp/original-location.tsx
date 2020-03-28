/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"

import { useStores } from "../../store"
import { Country } from "../../ui-kit/country/country"

export const OriginalLocation = observer(() => {
    const { connection } = useStores()
    const ipText = `IP: ${connection.originalLocation?.ip ?? "Unknown"}`
    return (
        <View
            style={`
                flex-direction: "row";
                align-items: "center";
                justify-content: "center";
            `}
        >
            <View
                style={`
                    padding-left: 15;
                    padding-right: 15;
                `}
            >
                <Country code={connection.originalLocation?.country} text={false} />
            </View>
            <View style={`flex-direction: "column";`}>
                <Text style={`font-weight: bold;`}>{connection.status}</Text>
                <Text style={`qproperty-alignment: AlignCenter;`}>{ipText}</Text>
            </View>
        </View>
    )
})
