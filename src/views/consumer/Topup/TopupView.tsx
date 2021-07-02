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
                <Redirect to={locations.walletTopupSelectAmount.path} />
            </Switch>
        </>
    )
})
