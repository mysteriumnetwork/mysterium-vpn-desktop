/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { Text, View } from "@nodegui/react-nodegui"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"

import { useStores } from "../../../store"
import { perGiB, perMinute } from "../../../payment/rate"

export const ConnectionProposal: React.FC<ViewProps<WidgetEventListeners>> = observer((props) => {
    const {
        connection: { proposal: { paymentMethod, providerId } = {} },
    } = useStores()
    const price = paymentMethod ? `${perMinute(paymentMethod)}/min ＋ ${perGiB(paymentMethod)}/GiB` : ""
    return (
        <View {...props}>
            <View style={`padding-bottom: 14; flex-direction: "row";`}>
                <Text style={`width: 120; color: #c0b3c9;`}>Provider ID</Text>
                <Text style={`flex: 1; color: #c0b3c9;`}>{providerId ?? ""}</Text>
            </View>
            <View style={`padding-bottom: 14; flex-direction: "row";`}>
                <Text style={`width: 120; color: #c0b3c9;`}>Price</Text>
                <Text style={`flex: 1; color: #c0b3c9;`}>{price}</Text>
            </View>
        </View>
    )
})
