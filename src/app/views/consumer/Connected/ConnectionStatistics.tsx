/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import byteSize from "byte-size"
import * as _ from "lodash"
import { ConnectionStatus, Currency } from "mysterium-vpn-js"
import styled from "styled-components"

import { useStores } from "../../../store"
import { IconDuration } from "../../../ui-kit/icons/IconDuration"
import { IconReceived } from "../../../ui-kit/icons/IconReceived"
import { IconSent } from "../../../ui-kit/icons/IconSent"
import { IconPaid } from "../../../ui-kit/icons/IconPaid"
import { brandLight, darkBlue, greyBlue1 } from "../../../ui-kit/colors"

const toClock = (duration: number): string => {
    const secs = Math.floor(duration % 60)
    const mins = Math.floor((duration % (60 * 60)) / 60)
    const hours = Math.floor(duration / (60 * 60))
    return [hours, mins, secs].map((n) => _.padStart(String(n), 2, "0")).join(":")
}

const Metrics = styled.div`
    border-radius: 10px;
    box-sizing: border-box;
    height: 238px;
    overflow: hidden;
    color: #8387a4;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`

const Metric = styled.div`
    width: 88px;
    height: 115px;
    box-sizing: border-box;
    padding: 15px 0;
    background: #f8f8fd;
    border-radius: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const MetricIcon = styled.div``

const MetricValue = styled.div`
    color: ${darkBlue};
    font-size: 15px;
    font-weight: bold;
`

const MetricLabel = styled.div`
    margin-top: auto;
`
const MetricUnit = styled.div``

const MetricPlaceholder = () => (
    <div>
        <svg width="19" height="2" viewBox="0 0 19 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.2" width="19" height="2" rx="1" fill="#8386A4" />
        </svg>
    </div>
)

export const ConnectionStatistics: React.FC = observer(function ConnectionStatistics() {
    const {
        connection: { statistics: { duration, bytesReceived, bytesSent, spentTokens } = {}, status },
    } = useStores()
    const clock = duration ? toClock(duration) : ""
    const down = bytesReceived ? byteSize(bytesReceived, { units: "iec" }) : undefined
    const up = bytesSent ? byteSize(bytesSent, { units: "iec" }) : undefined
    const paid = spentTokens?.human ?? 0
    const connected = status == ConnectionStatus.CONNECTED
    const iconColor = connected ? brandLight : greyBlue1
    return (
        <Metrics>
            <Metric>
                <MetricIcon>
                    <IconReceived color={iconColor} />
                </MetricIcon>
                <MetricLabel>Received</MetricLabel>
                <MetricValue>{connected ? down?.value : <MetricPlaceholder />}</MetricValue>
                <MetricUnit>{down?.unit}</MetricUnit>
            </Metric>
            <Metric>
                <MetricIcon>
                    <IconSent color={iconColor} />
                </MetricIcon>
                <MetricLabel>Sent</MetricLabel>
                <MetricValue>{connected ? up?.value : <MetricPlaceholder />}</MetricValue>
                <MetricUnit>{up?.unit}</MetricUnit>
            </Metric>
            <Metric>
                <MetricIcon>
                    <IconDuration color={iconColor} />
                </MetricIcon>
                <MetricLabel>Duration</MetricLabel>
                <MetricValue>{connected ? clock : <MetricPlaceholder />}</MetricValue>
                <MetricUnit>hh:mm:ss</MetricUnit>
            </Metric>
            <Metric>
                <MetricIcon>
                    <IconPaid color={iconColor} />
                </MetricIcon>
                <MetricLabel>Paid</MetricLabel>
                <MetricValue>{connected ? paid : <MetricPlaceholder />}</MetricValue>
                <MetricUnit>{Currency.MYST}</MetricUnit>
            </Metric>
        </Metrics>
    )
})
