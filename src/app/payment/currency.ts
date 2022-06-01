/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export const isLightningAvailable = (currency?: string): boolean => {
    return currency == "BTC" || currency == "LTC"
}

export interface AmountMultiCurrency {
    MYST?: number
    USD?: number
}
