/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { PaymentGateway } from "mysterium-vpn-js"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faBitcoin } from "@fortawesome/free-brands-svg-icons"
import { faCreditCard, faQuestionCircle } from "@fortawesome/free-solid-svg-icons"

export enum PaymentMethodName {
    COINGATE = "coingate",
    CARDINITY = "cardinity",
    MYST = "myst",
}

export enum Gateway {
    COINGATE = "coingate",
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
    [PaymentMethodName.COINGATE]: {
        displayOrder: 0,
        displayText: "Crypto",
        icon: faBitcoin,
        gateway: "coingate",
    },
    [PaymentMethodName.CARDINITY]: {
        displayOrder: 1,
        displayText: "Credit card",
        icon: faCreditCard,
        gateway: "cardinity",
    },
    [PaymentMethodName.MYST]: {
        displayOrder: 2,
        displayText: "MYST",
        icon: faQuestionCircle,
        gateway: "coingate",
    },
}
