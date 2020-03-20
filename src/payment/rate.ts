/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { mystDisplay, PaymentMethod, pricePerGiB, pricePerMinute } from "mysterium-vpn-js"

export const perMinute = (p: PaymentMethod): number | undefined => (p ? mystDisplay(pricePerMinute(p)) : undefined)

export const perGiB = (p: PaymentMethod): number | undefined => (p ? mystDisplay(pricePerGiB(p)) : undefined)
