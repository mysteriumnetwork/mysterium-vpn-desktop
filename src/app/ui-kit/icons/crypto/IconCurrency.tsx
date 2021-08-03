/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"

import { IconProps } from "../Props"

import { IconCurrencyBTC } from "./IconCurrencyBTC"
import { IconCurrencyLTC } from "./IconCurrencyLTC"
import { IconCurrencyMYST } from "./IconCurrencyMYST"
import { IconCurrencyUSDT } from "./IconCurrencyUSDT"
import { IconCurrencyETH } from "./IconCurrencyETH"

export type IconCurrencyProps = IconProps & {
    currency?: string
}

export const IconCurrency: React.FC<IconCurrencyProps> = ({ color, currency }) => {
    switch (currency) {
        case "BTC":
            return <IconCurrencyBTC color={color} />
        case "ETH":
            return <IconCurrencyETH color={color} />
        case "LTC":
            return <IconCurrencyLTC color={color} />
        case "USDT":
            return <IconCurrencyUSDT color={color} />
        case "MYST":
            return <IconCurrencyMYST color={color} />

        default:
            return <></>
    }
}
