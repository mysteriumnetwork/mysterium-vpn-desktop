/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text } from "@nodegui/react-nodegui"
import { PaymentMethod } from "mysterium-vpn-js"

import { perGiB, perMinute } from "./rate"

export type RateProps = {
    id?: string
    paymentMethod?: PaymentMethod
    units?: boolean
}

export const PerMinuteRate: React.FC<RateProps> = ({ id, paymentMethod, units }) => {
    if (!paymentMethod) {
        return <></>
    }
    const rate = `${perMinute(paymentMethod)}${units ? "/min" : ""}`
    return <Text id={id ?? "rate"}>{rate}</Text>
}

export const PerGiBRate: React.FC<RateProps> = ({ id, paymentMethod, units }) => {
    if (!paymentMethod) {
        return <></>
    }
    const rate = `${perGiB(paymentMethod)}${units ? "/GiB" : ""}`
    return <Text id={id ?? "rate"}>{rate}</Text>
}
