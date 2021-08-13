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
import { OnboardingView } from "../../../views/common/Onboarding/OnboardingView"
import { SelectProposalView } from "../../../views/consumer/SelectProposal/SelectProposalView"
import { ConnectedView } from "../../../views/consumer/Connected/ConnectedView"
import { WalletView } from "../../../views/consumer/Wallet/WalletView"
import { useStores } from "../../../store"
import { TitleBar } from "../TitleBar/TitleBar"
import { locations } from "../../locations"
import { winSize } from "../../../../config"
import ReferralView from "../../../views/consumer/Referral/ReferralView"
import { NakedTitleBar } from "../TitleBar/NakedTitleBar"
import { HelpView } from "../../../views/common/Help/HelpView"
import { SettingsView } from "../../../views/common/Settings/SettingsView"
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

    color: #404040;
    background: #fff;
`

export const Routes: React.FC = observer(() => {
    const { connection } = useStores()
    return (
        <>
            <WinContents>
                <Main>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to={locations.loading} />
                        </Route>
                        <Route path={locations.onboarding}>
                            <NakedTitleBar />
                            <OnboardingView />
                        </Route>
                        <Route path={locations.terms}>
                            <NakedTitleBar />
                            <AcceptTermsView />
                        </Route>
                        <Route path={locations.proposals}>
                            <TitleBar />
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
                            <TitleBar />
                            <ConnectedView />
                        </Route>
                        <Route path={locations.settings}>
                            <TitleBar />
                            <SettingsView />
                        </Route>
                        <Route path={locations.referrals}>
                            <TitleBar />
                            <ReferralView />
                        </Route>
                        <Route path={locations.walletTopup}>
                            <TitleBar />
                            <TopupView />
                        </Route>
                        <Route path={locations.wallet}>
                            <TitleBar />
                            <WalletView />
                        </Route>
                        <Route path={locations.help}>
                            <TitleBar />
                            <HelpView />
                        </Route>

                        <Route path={locations.loading}>
                            <NakedTitleBar />
                            <LoadingView />
                        </Route>
                    </Switch>
                </Main>
            </WinContents>
        </>
    )
})
