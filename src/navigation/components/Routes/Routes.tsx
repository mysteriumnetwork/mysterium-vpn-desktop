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
import { Modal } from "../../../ui-kit/components/Modal/Modal"
import { FiltersView } from "../../../views/consumer/Filters/FiltersView"
import { NavBar } from "../NavBar/NavBar"
import { locations } from "../../locations"
import { Chat } from "../../../feedback/components/Chat/Chat"
import { winSize } from "../../../config"
import { ReportIssueView } from "../../../views/common/ReporIssue/ReportIssueView"
import { Preferences } from "../../../preferences/components/Preferences/Preferences"
import { ActivateAccount } from "../../../views/common/ActivateAccount/ActivateAccount"
import { TopupView } from "../../../views/consumer/Topup/TopupView"

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
`

export const Routes: React.FC = observer(() => {
    const { connection, navigation } = useStores()
    return (
        <>
            <WinContents>
                <Main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={locations.loading} />
                        </Route>
                        <Route path={locations.topup}>
                            <TopupView />
                        </Route>
                        <Route path={locations.welcome}>
                            <WelcomeView />
                        </Route>
                        <Route path={locations.terms}>
                            <AcceptTermsView />
                        </Route>
                        <Route path={locations.activate}>
                            <ActivateAccount />
                        </Route>
                        <Route path={locations.activateTopup}>
                            <ActivateAccountTopup />
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
                    <Modal visible={navigation.report} onClose={() => navigation.openReportIssue(false)} light>
                        <ReportIssueView />
                    </Modal>
                    <Modal visible={navigation.preferences} onClose={() => navigation.openPreferences(false)} light>
                        <Preferences />
                    </Modal>
                </Main>
                {navigation.chat && <Chat />}
            </WinContents>
        </>
    )
})
