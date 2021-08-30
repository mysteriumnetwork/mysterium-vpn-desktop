/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"
import Lottie from "react-lottie-player"

import { IconProps } from "../../icons/Props"

import animationBTC from "./animation_btc.json"
import animationDAI from "./animation_dai.json"
import animationETH from "./animation_eth.json"
import animationLTC from "./animation_ltc.json"
import animationMYST from "./animation_myst.json"
import animationUSDT from "./animation_usdt.json"
import animationDOGE from "./animation_doge.json"

export type IconCurrencyProps = IconProps & {
    currency?: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
const animations: { [key: string]: object } = {
    BTC: animationBTC,
    BCH: animationBTC,
    ETH: animationETH,
    DAI: animationDAI,
    LTC: animationLTC,
    USDT: animationUSDT,
    MYST: animationMYST,
    DOGE: animationDOGE,
}

export const CryptoAnimation: React.FC<IconCurrencyProps> = ({ currency }) => {
    const animationData = animations[currency ?? ""]
    if (!animationData) {
        return <></>
    }
    return <Lottie play loop={false} animationData={animationData} style={{ width: 256, height: 256 }} renderer="svg" />
}
