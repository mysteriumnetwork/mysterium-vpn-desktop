/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { HashRouter, Route, Switch } from "react-router-dom"

import { LoadingView } from "./views/common/loading/loading-view"
import { AcceptTermsView } from "./views/common/accept-terms/accept-terms-view"
import { WelcomeView } from "./views/common/welcome/welcome-view"
import { SelectIdentityView } from "./views/common/select-identity/select-identity-view"

export const App: React.FC = () => {
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
                <Route path="/loading">
                    <LoadingView />
                </Route>
            </Switch>
        </HashRouter>
    )
    /*// Poor man's navigation, but performs better than re-rendering the whole screen.
    let screen: Nav
    if (daemon.status == DaemonStatusType.Down) {
        screen = Nav.Loader
    } else if (!config.currentTermsAgreed() && root.welcome) {
        screen = Nav.Welcome
    } else if (!config.currentTermsAgreed()) {
        screen = Nav.AcceptTerms
    } else if (
        !identity.identity ||
        identity.identity.registrationStatus !== IdentityRegistrationStatus.RegisteredConsumer
    ) {
        screen = Nav.SelectIdentity
    } else if (root.wallet) {
        screen = Nav.Wallet
    } else if (connection.status != ConnectionStatus.NOT_CONNECTED) {
        screen = Nav.ConnectionActive
    } else {
        screen = Nav.SelectProposal
    }

    return (
        <View>
            <LoadingView style={fitWindowIfVisible(screen == Nav.Loader)} />
            <WelcomeView style={fitWindowIfVisible(screen == Nav.Welcome)} />
            <AcceptTermsView style={fitWindowIfVisible(screen == Nav.AcceptTerms)} />
            <SelectIdentityView style={fitWindowIfVisible(screen == Nav.SelectIdentity)} />
            <SelectProposalView style={fitWindowIfVisible(screen == Nav.SelectProposal)} />
            <ConnectedView style={fitWindowIfVisible(screen == Nav.ConnectionActive)} />
            <WalletView style={fitWindowIfVisible(screen == Nav.Wallet)} />
        </View>
    )*/
}
