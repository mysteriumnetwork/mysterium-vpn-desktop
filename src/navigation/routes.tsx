/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { HashRouter, Redirect, Route, Switch } from "react-router-dom"
import { ConnectionStatus } from "mysterium-vpn-js"
import { observer } from "mobx-react-lite"

import { LoadingView } from "../views/common/loading/loading-view"
import { AcceptTermsView } from "../views/common/accept-terms/accept-terms-view"
import { WelcomeView } from "../views/common/welcome/welcome-view"
import { SelectIdentityView } from "../views/common/select-identity/select-identity-view"
import { SelectProposalView } from "../views/consumer/select-proposal/select-proposal-view"
import { ConnectedView } from "../views/consumer/connected/connected-view"
import { WalletView } from "../views/consumer/wallet/wallet-view"
import { NavBar } from "../navbar"
import { useStores } from "../store"

import { locations } from "./locations"

export const Routes: React.FC = observer(() => {
    const { connection } = useStores()
    return (
        <HashRouter>
            <Switch>
                <Route path={locations.welcome}>
                    <WelcomeView />
                </Route>
                <Route path={locations.terms}>
                    <AcceptTermsView />
                </Route>
                <Route path={locations.identity}>
                    <SelectIdentityView />
                </Route>
                <Route path={locations.proposals}>
                    <NavBar />
                    <SelectProposalView />
                </Route>
                <Route path={locations.consumer} exact>
                    <Redirect
                        to={
                            connection.status === ConnectionStatus.NOT_CONNECTED
                                ? locations.proposals
                                : locations.connection
                        }
                        push
                    />
                </Route>
                <Route path={locations.connection}>
                    <NavBar />
                    <ConnectedView />
                </Route>
                <Route path={locations.wallet}>
                    <NavBar />
                    <WalletView />
                </Route>
                <Route path={locations.loading}>
                    <LoadingView />
                </Route>
            </Switch>
        </HashRouter>
    )
})
