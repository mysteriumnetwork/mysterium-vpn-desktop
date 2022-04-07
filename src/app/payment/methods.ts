/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { PaymentGateway } from "mysterium-vpn-js"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faBitcoin, faPaypal } from "@fortawesome/free-brands-svg-icons"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"

export enum PaymentMethodName {
    COINGATE = "coingate",
    PAYPAL = "paypal",
    STRIPE = "stripe",
    MYST = "myst",
}

export enum Gateway {
    COINGATE = "coingate",
    PAYPAL = "paypal",
    STRIPE = "stripe",
}

export interface PaymentMethodMetadata {
    displayOrder: number
    displayText: string
    gateway: string
    icon?: IconProp
}

export type PaymentMethod = {
    name: PaymentMethodName
    gatewayData: PaymentGateway
} & PaymentMethodMetadata

export const SUPPORTED_METHODS: { [key: string]: PaymentMethodMetadata } = {
    [PaymentMethodName.COINGATE]: {
        displayOrder: 0,
        displayText: "Crypto",
        icon: faBitcoin,
        gateway: "coingate",
    },
    [PaymentMethodName.PAYPAL]: {
        displayOrder: 1,
        displayText: "Paypal",
        icon: faPaypal,
        gateway: "paypal",
    },
    [PaymentMethodName.STRIPE]: {
        displayOrder: 2,
        displayText: "Credit card",
        icon: faCreditCard,
        gateway: "stripe",
    },
    [PaymentMethodName.MYST]: {
        displayOrder: 3,
        displayText: "MYST",
        gateway: "coingate",
    },
}
