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

import { TopupSelectAmount } from "./TopupSelectAmount"
import { CoingatePaymentOptions } from "./coingate/CoingatePaymentOptions"
import { CoingateWaitingForPayment } from "./coingate/CoingateWaitingForPayment"
import { TopupSuccess } from "./TopupSuccess"
import { TopupFailed } from "./TopupFailed"
import { TopupChooseMethod } from "./TopupChooseMethod"
import { CardinityPaymentOptions } from "./cardinity/CardinityPaymentOptions"
import { CardinityWaitingForPayment } from "./cardinity/CardinityWaitingForPayment"
import { CardinityOrderSummary } from "./cardinity/CardinityOrderSummary"
import { CoingateOrderSummary } from "./coingate/CoingateOrderSummary"

export const TopupView: React.FC = observer(() => {
    const { url } = useRouteMatch()
    return (
        <>
            <Switch>
                <Route path={"*/" + topupSteps.selectAmount}>
                    <TopupSelectAmount />
                </Route>
                <Route path={"*/" + topupSteps.chooseMethod}>
                    <TopupChooseMethod />
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
                <Route path={"*/" + topupSteps.coingatePaymentOptions}>
                    <CoingatePaymentOptions />
                </Route>
                <Route path={"*/" + topupSteps.coingateOrderSummary}>
                    <CoingateOrderSummary />
                </Route>
                <Route path={"*/" + topupSteps.coingateWaitingForPayment}>
                    <CoingateWaitingForPayment />
                </Route>
                <Route path={"*/" + topupSteps.success}>
                    <TopupSuccess />
                </Route>
                <Route path={"*/" + topupSteps.failed}>
                    <TopupFailed />
                </Route>
                <Redirect to={`${url}/select-amount`} />
            </Switch>
        </>
    )
})
