/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { HashRouter, Route, Switch } from "react-router-dom"

import { LoadingView } from "../views/common/loading/loading-view"
import { AcceptTermsView } from "../views/common/accept-terms/accept-terms-view"
import { WelcomeView } from "../views/common/welcome/welcome-view"
import { SelectIdentityView } from "../views/common/select-identity/select-identity-view"
import { SelectProposalView } from "../views/consumer/select-proposal/select-proposal-view"
import { ConnectedView } from "../views/consumer/connected/connected-view"
import { WalletView } from "../views/consumer/wallet/wallet-view"

export const Routes: React.FC = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/welcome">
                    <WelcomeView />
                </Route>
                <Route path="/terms">
                    <AcceptTermsView />
                </Route>
                <Route path="/identity">
                    <SelectIdentityView />
                </Route>
                <Route path="/proposals">
                    <SelectProposalView />
                </Route>
                <Route path="/connection">
                    <ConnectedView />
                </Route>
                <Route path="/wallet">
                    <WalletView />
                </Route>
                <Route path="/loading">
                    <LoadingView />
                </Route>
            </Switch>
        </HashRouter>
    )
}
