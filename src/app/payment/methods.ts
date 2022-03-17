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

import { IconMystToken } from "../../../src/app/ui-kit/icons/IconMystToken"

export enum PaymentMethodName {
    COINGATE = "coingate",
    PAYPAL = "paypal",
    CARDINITY = "cardinity",
    MYST = "myst",
}

export enum Gateway {
    COINGATE = "coingate",
    PAYPAL = "paypal",
    CARDINITY = "cardinity",
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
    [PaymentMethodName.MYST]: {
        displayOrder: 0,
        displayText: "MYST",
        icon: IconMystToken,
        gateway: "coingate",
    },
    [PaymentMethodName.COINGATE]: {
        displayOrder: 1,
        displayText: "Crypto",
        icon: faBitcoin,
        gateway: "coingate",
    },
    [PaymentMethodName.PAYPAL]: {
        displayOrder: 2,
        displayText: "Paypal",
        icon: faPaypal,
        gateway: "paypal",
    },
    [PaymentMethodName.CARDINITY]: {
        displayOrder: 3,
        displayText: "Credit card",
        icon: faCreditCard,
        gateway: "cardinity",
    },
}
