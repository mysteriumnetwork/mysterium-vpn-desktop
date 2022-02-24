/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom"

import { topupSteps } from "../../../navigation/locations"

import { CoingatePaymentOptions } from "./coingate/CoingatePaymentOptions"
import { CoingateWaitingForPayment } from "./coingate/CoingateWaitingForPayment"
import { TopupSuccess } from "./TopupSuccess"
import { TopupFailed } from "./TopupFailed"
import { TopupChooseMethod } from "./TopupChooseMethod"
import { CardinityPaymentOptions } from "./cardinity/CardinityPaymentOptions"
import { CardinityWaitingForPayment } from "./cardinity/CardinityWaitingForPayment"
import { CardinityOrderSummary } from "./cardinity/CardinityOrderSummary"
import { CoingateOrderSummary } from "./coingate/CoingateOrderSummary"
import { MystChooseChain } from "./myst/MystChooseChain"
import { CoingateSelectAmount } from "./coingate/CoingateSelectAmount"
import { CardinitySelectAmount } from "./cardinity/CardinitySelectAmount"
import { MystSelectAmount } from "./myst/MystSelectAmount"
import { MystPolygonWaitingForPayment } from "./myst/MystPolygonWaitingForPayment"
import { PaypalSelectAmount } from "./paypal/PaypalSelectAmount"
import { PaypalPaymentOptions } from "./paypal/PaypalPaymentOptions"
import { PaypalOrderSummary } from "./paypal/PaypalOrderSummary"
import { PaypalWaitingForPayment } from "./paypal/PaypalWaitingForPayment"

export const TopupView: React.FC = observer(() => {
    const { url } = useRouteMatch()
    return (
        <>
            <Switch>
                <Route path={"*/" + topupSteps.chooseMethod}>
                    <TopupChooseMethod />
                </Route>

                <Route path={"*/" + topupSteps.coingate}>
                    <Redirect to={`${url}/${topupSteps.coingateSelectAmount}`} />
                </Route>
                <Route path={"*/" + topupSteps.coingateSelectAmount}>
                    <CoingateSelectAmount />
                </Route>
                <Route path={"*/" + topupSteps.coingatePaymentOptions}>
                    <CoingatePaymentOptions />
                </Route>
                <Route path={"*/" + topupSteps.coingateOrderSummary}>
                    <CoingateOrderSummary />
                </Route>
                <Route path={"*/" + topupSteps.coingateWaitingForPayment}>
                    <CoingateWaitingForPayment />
                </Route>

                <Route path={"*/" + topupSteps.cardinity}>
                    <Redirect to={`${url}/${topupSteps.cardinitySelectAmount}`} />
                </Route>
                <Route path={"*/" + topupSteps.cardinitySelectAmount}>
                    <CardinitySelectAmount />
                </Route>
                <Route path={"*/" + topupSteps.cardinityPaymentOptions}>
                    <CardinityPaymentOptions />
                </Route>
                <Route path={"*/" + topupSteps.cardinityOrderSummary}>
                    <CardinityOrderSummary />
                </Route>
                <Route path={"*/" + topupSteps.cardinityWaitingForPayment}>
                    <CardinityWaitingForPayment />
                </Route>

                <Route path={"*/" + topupSteps.paypal}>
                    <Redirect to={`${url}/${topupSteps.paypalSelectAmount}`} />
                </Route>
                <Route path={"*/" + topupSteps.paypalSelectAmount}>
                    <PaypalSelectAmount />
                </Route>
                <Route path={"*/" + topupSteps.paypalPaymentOptions}>
                    <PaypalPaymentOptions />
                </Route>
                <Route path={"*/" + topupSteps.paypalOrderSummary}>
                    <PaypalOrderSummary />
                </Route>
                <Route path={"*/" + topupSteps.paypalWaitingForPayment}>
                    <PaypalWaitingForPayment />
                </Route>

                <Route path={"*/" + topupSteps.myst}>
                    <Redirect to={`${url}/${topupSteps.mystChooseChain}`} />
                </Route>
                <Route path={"*/" + topupSteps.mystChooseChain}>
                    <MystChooseChain />
                </Route>
                <Route path={"*/" + topupSteps.mystSelectAmount}>
                    <MystSelectAmount />
                </Route>
                <Route path={"*/" + topupSteps.mystPolygonWaitingForPayment}>
                    <MystPolygonWaitingForPayment />
                </Route>

                <Route path={"*/" + topupSteps.success}>
                    <TopupSuccess />
                </Route>
                <Route path={"*/" + topupSteps.failed}>
                    <TopupFailed />
                </Route>
                <Redirect to={`${url}/${topupSteps.chooseMethod}`} />
            </Switch>
        </>
    )
})
