/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { PaymentMethod, pricePerGiB, pricePerMinute } from "mysterium-vpn-js"

import { fmtMoney } from "./display"

export const perMinute = (p: PaymentMethod): string | undefined => (p ? fmtMoney(pricePerMinute(p)) : undefined)

export const perGiB = (p: PaymentMethod): string | undefined => (p ? fmtMoney(pricePerGiB(p)) : undefined)
