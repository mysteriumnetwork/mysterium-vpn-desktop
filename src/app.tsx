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
import { Spinner } from "./ui-kit/spinner/spinner"
import { winSize } from "./config"
import { ConnectedView } from "./views/consumer/connected/connected-view"
import { SelectIdentityView } from "./views/common/select-identity/select-identity-view"
import { WalletView } from "./views/consumer/wallet/wallet-view"

// To avoid hiccups on screen re-render, render all screens and use positioning to switch between them.
// Visibility is calculated as (window width) * (index in element order) * (-1).
// Hidden elements are rendered to the right of the visible area and shifted left
const visibilityStyle = (idx: number, visible: boolean): string => {
    return visible ? `left: ${winSize.width * idx * -1};` : `left: 1000;`
}

const fitWindowStyle = `width: ${winSize.width}; height: ${winSize.height};`

enum Nav {
    Loader,
    SelectIdentity,
    SelectProposal,
    ConnectionActive,
    Wallet,
}

export const App = observer(() => {
    const root = useStores()
    const { daemon, connection, identity } = root

    // Poor man's navigation, but performs better than re-rendering the whole screen.
    let screen: Nav
    if (daemon.status == DaemonStatusType.Down) {
        screen = Nav.Loader
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
            <View style={`background: #ecf0f1; ${fitWindowStyle} ${visibilityStyle(0, screen == Nav.Loader)}`}>
                <Spinner active top={(winSize.height - 200) / 2} left={(winSize.width - 200) / 2} />
            </View>
            <SelectIdentityView style={`${fitWindowStyle} ${visibilityStyle(1, screen == Nav.SelectIdentity)}`} />
            <SelectProposalView style={`${fitWindowStyle} ${visibilityStyle(2, screen == Nav.SelectProposal)}`} />
            <ConnectedView style={`${fitWindowStyle} ${visibilityStyle(3, screen == Nav.ConnectionActive)}`} />
            <WalletView style={`${fitWindowStyle} ${visibilityStyle(4, screen == Nav.Wallet)}`} />
        </View>
    )
})
