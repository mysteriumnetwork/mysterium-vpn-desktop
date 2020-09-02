/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { DECIMAL_PART_V3, displayMoney, DisplayMoneyOptions } from "mysterium-vpn-js"
import { Money } from "mysterium-vpn-js/lib/payment/method"

export const decimalPart = (): number => {
    return DECIMAL_PART_V3
}

export const fmtMoney = (m: Money, opts?: DisplayMoneyOptions): string => {
    return displayMoney(m, {
        ...opts,
        decimalPart: decimalPart(),
    })
}
