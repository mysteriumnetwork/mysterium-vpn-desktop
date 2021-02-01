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
import styled from "styled-components"

import { LoadingView } from "../../../views/common/Loading/loading-view"
import { AcceptTermsView } from "../../../views/common/AcceptTerms/AcceptTermsView"
import { WelcomeView } from "../../../views/common/Welcome/WelcomeView"
import { ActivateAccountTopup } from "../../../views/common/ActivateAccountTopup/ActivateAccountTopup"
import { SelectProposalView } from "../../../views/consumer/SelectProposal/SelectProposalView"
import { ConnectedView } from "../../../views/consumer/Connected/ConnectedView"
import { WalletView } from "../../../views/consumer/Wallet/WalletView"
import { useStores } from "../../../store"
import { FiltersView } from "../../../views/consumer/Filters/FiltersView"
import { NavBar } from "../NavBar/NavBar"
import { locations } from "../../locations"
import { Chat } from "../../../feedback/components/Chat/Chat"
import { winSize } from "../../../config"
import { ReportIssueView } from "../../../views/common/ReporIssue/ReportIssueView"
import { Preferences } from "../../../preferences/components/Preferences/Preferences"
import { ActivateAccount } from "../../../views/common/ActivateAccount/ActivateAccount"
import { TopupView } from "../../../views/consumer/Topup/TopupView"
import ReferralView from "../../../views/consumer/Referral/ReferralView"

const WinContents = styled.div`
    min-height: 0;
    flex: 1;
    display: flex;
    flex-direction: row;
`

const Main = styled.div`
    width: ${winSize.width}px;
    display: flex;
    flex-direction: column;

    color: #404040;
    background: #fff;
`

export const Routes: React.FC = observer(() => {
    const { connection, navigation } = useStores()
    return (
        <>
            <WinContents>
                <Main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={locations.loading.path} />
                        </Route>
                        <Route path={locations.topup.path}>
                            <TopupView />
                        </Route>
                        <Route path={locations.welcome.path}>
                            <WelcomeView />
                        </Route>
                        <Route path={locations.terms.path}>
                            <AcceptTermsView />
                        </Route>
                        <Route path={locations.activate.path}>
                            <ActivateAccount />
                        </Route>
                        <Route path={locations.activateTopup.path}>
                            <ActivateAccountTopup />
                        </Route>
                        <Route path={locations.proposals.path}>
                            <NavBar />
                            <SelectProposalView />
                        </Route>
                        <Route path={locations.consumer.path} exact>
                            <Redirect
                                to={
                                    connection.status === ConnectionStatus.NOT_CONNECTED
                                        ? locations.proposals.path
                                        : locations.connection.path
                                }
                                push
                            />
                        </Route>
                        <Route path={locations.connection.path}>
                            <NavBar />
                            <ConnectedView />
                        </Route>
                        <Route path={locations.preferences.path} exact>
                            <NavBar />
                            <Preferences />
                        </Route>
                        <Route path={locations.preferencesFilters.path} exact>
                            <NavBar />
                            <FiltersView />
                        </Route>
                        <Route path={locations.referrals.path}>
                            <NavBar />
                            <ReferralView />
                        </Route>
                        <Route path={locations.wallet.path}>
                            <NavBar />
                            <WalletView />
                        </Route>
                        <Route path={locations.reportIssue.path}>
                            <NavBar />
                            <ReportIssueView />
                        </Route>
                        <Route path={locations.loading.path}>
                            <LoadingView />
                        </Route>
                    </Switch>
                </Main>
                {navigation.chat && <Chat />}
            </WinContents>
        </>
    )
})
