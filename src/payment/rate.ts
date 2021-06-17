/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Price } from "mysterium-vpn-js/lib/proposal/price"
import { Decimal } from "decimal.js-light"

import { fmtMoney } from "./display"

export const perHour = (p: Price | undefined): string =>
    p ? fmtMoney({ amount: p.perHour, currency: p.currency }, { fractionDigits: 4 }) : ""

export const perGiB = (p: Price | undefined): string =>
    p ? fmtMoney({ amount: p.perGib, currency: p.currency }, { fractionDigits: 4 }) : ""

export const mystToUSD = (myst: number, rate?: number): number | undefined => {
    if (!rate) {
        return
    }
    let dec
    try {
        dec = new Decimal(myst)
    } catch (err) {
        dec = new Decimal(0)
    }
    return dec.times(rate).toNumber()
}
