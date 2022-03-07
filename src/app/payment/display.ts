/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { DECIMAL_PART, Tokens } from "mysterium-vpn-js"
import BigNumber from "bignumber.js"

export const decimalPart = (): number => {
    return DECIMAL_PART
}

export const displayUSD = (amount: number): string => {
    return "$" + new BigNumber(amount).toFixed(2)
}

export const displayTokens2 = (tokens?: Tokens): string => {
    return new BigNumber(tokens?.human ?? 0).toFixed(2)
}

export const displayTokens4 = (tokens?: Tokens): string => {
    return new BigNumber(tokens?.human ?? 0).toFixed(4)
}
