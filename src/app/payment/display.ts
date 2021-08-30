/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { DECIMAL_PART, displayMoney, DisplayMoneyOptions, Money } from "mysterium-vpn-js"
import { Decimal } from "decimal.js-light"

export const decimalPart = (): number => {
    return DECIMAL_PART
}

export const fmtMoney = (m: Money, opts?: DisplayMoneyOptions): string => {
    return displayMoney(m, {
        ...opts,
        decimalPart: decimalPart(),
    })
}

export const displayUSD = (amount: number): string => {
    return "$" + new Decimal(amount).toFixed(4)
}
