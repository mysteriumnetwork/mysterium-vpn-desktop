/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { PaymentMethod, pricePerGiB, pricePerHour } from "mysterium-vpn-js"

import { fmtMoney } from "./display"

export const perHour = (p: PaymentMethod): string => (p ? fmtMoney(pricePerHour(p), { fractionDigits: 4 }) : "")

export const perGiB = (p: PaymentMethod): string => (p ? fmtMoney(pricePerGiB(p), { fractionDigits: 4 }) : "")
