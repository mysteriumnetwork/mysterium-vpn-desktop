/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BigNumber from "bignumber.js"

export const mystToUSD = (myst: number, rate?: number): number | undefined => {
    if (!rate) {
        return
    }
    return new BigNumber(myst).times(rate).toNumber()
}
