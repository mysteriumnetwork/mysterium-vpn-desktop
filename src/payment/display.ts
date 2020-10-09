/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { DECIMAL_PART, displayMoney, DisplayMoneyOptions } from "mysterium-vpn-js"
import { Money } from "mysterium-vpn-js/lib/payment/method"
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

export const displayMYST = (amount: number): string => {
    return new Decimal(amount).toFixed(4) + " MYSTT"
}

export const displayUSD = (amount: number): string => {
    return "$" + new Decimal(amount).toFixed(4)
}
