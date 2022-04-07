/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { Route, Routes as ReactRoutes } from "react-router-dom"

import { topupSteps } from "../../../navigation/locations"

import { CoingatePaymentOptions } from "./coingate/CoingatePaymentOptions"
import { CoingateWaitingForPayment } from "./coingate/CoingateWaitingForPayment"
import { TopupSuccess } from "./TopupSuccess"
import { TopupFailed } from "./TopupFailed"
import { TopupChooseMethod } from "./TopupChooseMethod"
import { StripePaymentOptions } from "./stripe/StripePaymentOptions"
import { StripeWaitingForPayment } from "./stripe/StripeWaitingForPayment"
import { StripeOrderSummary } from "./stripe/StripeOrderSummary"
import { CoingateOrderSummary } from "./coingate/CoingateOrderSummary"
import { MystChooseChain } from "./myst/MystChooseChain"
import { CoingateSelectAmount } from "./coingate/CoingateSelectAmount"
import { StripeSelectAmount } from "./stripe/StripeSelectAmount"
import { MystSelectAmount } from "./myst/MystSelectAmount"
import { MystPolygonWaitingForPayment } from "./myst/MystPolygonWaitingForPayment"
import { PaypalSelectAmount } from "./paypal/PaypalSelectAmount"
import { PaypalPaymentOptions } from "./paypal/PaypalPaymentOptions"
import { PaypalOrderSummary } from "./paypal/PaypalOrderSummary"
import { PaypalWaitingForPayment } from "./paypal/PaypalWaitingForPayment"

export const TopupRoutes: React.FC = observer(function TopupRoutes() {
    return (
        <ReactRoutes>
            <Route path="*" element={<TopupChooseMethod />} />

            <Route path={topupSteps.coingate} element={<CoingateSelectAmount />} />
            <Route path={topupSteps.coingatePaymentOptions} element={<CoingatePaymentOptions />} />
            <Route path={topupSteps.coingateOrderSummary} element={<CoingateOrderSummary />} />
            <Route path={topupSteps.coingateWaitingForPayment} element={<CoingateWaitingForPayment />} />

            <Route path={topupSteps.stripe} element={<StripeSelectAmount />} />
            <Route path={topupSteps.stripePaymentOptions} element={<StripePaymentOptions />} />
            <Route path={topupSteps.stripeOrderSummary} element={<StripeOrderSummary />} />
            <Route path={topupSteps.stripeWaitingForPayment} element={<StripeWaitingForPayment />} />

            <Route path={topupSteps.paypal} element={<PaypalSelectAmount />} />
            <Route path={topupSteps.paypalPaymentOptions} element={<PaypalPaymentOptions />} />
            <Route path={topupSteps.paypalOrderSummary} element={<PaypalOrderSummary />} />
            <Route path={topupSteps.paypalWaitingForPayment} element={<PaypalWaitingForPayment />} />

            <Route path={topupSteps.myst} element={<MystChooseChain />} />
            <Route path={topupSteps.mystSelectAmount} element={<MystSelectAmount />} />
            <Route path={topupSteps.mystPolygonWaitingForPayment} element={<MystPolygonWaitingForPayment />} />

            <Route path={topupSteps.success} element={<TopupSuccess />} />
            <Route path={topupSteps.failed} element={<TopupFailed />} />
        </ReactRoutes>
    )
})
