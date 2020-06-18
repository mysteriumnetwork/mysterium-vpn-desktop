/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { ConnectionStatus } from "mysterium-vpn-js"
import { observer } from "mobx-react-lite"

import { LoadingView } from "../../../views/common/Loading/loading-view"
import { AcceptTermsView } from "../../../views/common/AcceptTerms/AcceptTermsView"
import { WelcomeView } from "../../../views/common/Welcome/WelcomeView"
import { SelectIdentityView } from "../../../views/common/SelectIdentity/SelectIdentityView"
import { SelectProposalView } from "../../../views/consumer/SelectProposal/SelectProposalView"
import { ConnectedView } from "../../../views/consumer/Connected/ConnectedView"
import { WalletView } from "../../../views/consumer/Wallet/WalletView"
import { useStores } from "../../../store"
import { Modal } from "../../../ui-kit/components/Modal/Modal"
import { FiltersView } from "../../../views/consumer/Filters/FiltersView"
import { NavBar } from "../NavBar/NavBar"
import { locations } from "../../locations"

export const Routes: React.FC = observer(() => {
    const { connection, navigation } = useStores()
    return (
        <>
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
            <Modal visible={navigation.wallet} onClose={navigation.toggleWallet}>
                <WalletView />
            </Modal>
            <Modal visible={navigation.filters} onClose={navigation.toggleFilters} light>
                <FiltersView />
            </Modal>
        </>
    )
})
