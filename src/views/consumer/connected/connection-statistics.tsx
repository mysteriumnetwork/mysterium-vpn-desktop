/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { View } from "@nodegui/react-nodegui"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"
import byteSize from "byte-size"
import * as _ from "lodash"

import { useStores } from "../../../store"
import { mystDisplay } from "../wallet/wallet-view"

import { Metric } from "./metric"

const toClock = (duration: number): string => {
    const secs = Math.floor(duration % 60)
    const mins = Math.floor((duration % (60 * 60)) / 60)
    const hours = Math.floor(duration / (60 * 60))
    return [hours, mins, secs].map((n) => _.padStart(String(n), 2, "0")).join(":")
}

export const ConnectionStatistics: React.FC<ViewProps<WidgetEventListeners>> = observer((props) => {
    const {
        connection: { statistics: { duration, bytesReceived, bytesSent, tokensSpent } = {} },
    } = useStores()
    const clock = duration ? toClock(duration) : ""
    const down = bytesReceived ? byteSize(bytesReceived, { units: "iec" }) : ""
    const up = bytesSent ? byteSize(bytesSent, { units: "iec" }) : ""
    const paid = mystDisplay(tokensSpent) + " MYSTT"
    return (
        <View {...props}>
            <Metric name="Duration" value={clock} />
            <Metric name="Downloaded" value={down} />
            <Metric name="Uploaded" value={up} />
            <Metric name="Paid" value={paid} />
        </View>
    )
})
