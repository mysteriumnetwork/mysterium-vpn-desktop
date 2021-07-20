/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { Redirect, Route, Switch } from "react-router-dom"

import { locations } from "../../../navigation/locations"

import { TopupSelectAmount } from "./TopupSelectAmount"
import { TopupSelectCurrency } from "./TopupSelectCurrency"
import { TopupWaitingForPayment } from "./TopupWaitingForPayment"
import { TopupSuccess } from "./TopupSuccess"
import { TopupFailed } from "./TopupFailed"

export const TopupView: React.FC = observer(() => {
    return (
        <>
            <Switch>
                <Route exact path={locations.walletTopupSelectAmount.path}>
                    <TopupSelectAmount />
                </Route>
                <Route exact path={locations.walletTopupSelectCurrency.path}>
                    <TopupSelectCurrency />
                </Route>
                <Route exact path={locations.walletTopupWaitingForPayment.path}>
                    <TopupWaitingForPayment />
                </Route>
                <Route exact path={locations.walletTopupSuccess.path}>
                    <TopupSuccess />
                </Route>
                <Route exact path={locations.walletTopupFailed.path}>
                    <TopupFailed />
                </Route>
                <Redirect to={locations.walletTopupSelectAmount.path} />
            </Switch>
        </>
    )
})
