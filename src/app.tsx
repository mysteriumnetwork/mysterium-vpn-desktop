/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { View } from "@nodegui/react-nodegui"
import { ConnectionStatus, IdentityRegistrationStatus } from "mysterium-vpn-js"

import { useStores } from "./store"
import { DaemonStatusType } from "./daemon/store"
import { SelectProposalView } from "./views/consumer/select-proposal/select-proposal-view"
import { winSize } from "./config"
import { ConnectedView } from "./views/consumer/connected/connected-view"
import { SelectIdentityView } from "./views/common/select-identity/select-identity-view"
import { WalletView } from "./views/consumer/wallet/wallet-view"
import { LoadingView } from "./views/common/loading/loading-view"
import { AcceptTermsView } from "./views/common/accept-terms/accept-terms-view"
import { WelcomeView } from "./views/common/welcome/welcome-view"

// To avoid hiccups on screen re-render, render all screens and use style to switch between them.
// Hidden elements have zero width.
const fitWindowIfVisible = (visible: boolean): string => {
    return `width: ${visible ? winSize.width : 0}; height: ${winSize.height};`
}

enum Nav {
    Loader,
    Welcome,
    AcceptTerms,
    SelectIdentity,
    SelectProposal,
    ConnectionActive,
    Wallet,
}

export const App = observer(() => {
    const root = useStores()
    const { daemon, connection, identity, config } = root

    // Poor man's navigation, but performs better than re-rendering the whole screen.
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
    )
})
