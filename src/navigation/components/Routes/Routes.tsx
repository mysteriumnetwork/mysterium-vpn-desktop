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
import { ActivateAccountTopup } from "../../../views/common/ActivateAccountTopup/ActivateAccountTopup"
import { SelectProposalView } from "../../../views/consumer/SelectProposal/SelectProposalView"
import { ConnectedView } from "../../../views/consumer/Connected/ConnectedView"
import { WalletView } from "../../../views/consumer/Wallet/WalletView"
import { useStores } from "../../../store"
import { TitleBar } from "../TitleBar/TitleBar"
import { locations } from "../../locations"
import { winSize } from "../../../config"
import { ActivateAccount } from "../../../views/common/ActivateAccount/ActivateAccount"
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
                            <Redirect to={locations.loading.path} />
                        </Route>
                        <Route path={locations.onboarding.path}>
                            <NakedTitleBar />
                            <OnboardingView />
                        </Route>
                        <Route path={locations.terms.path}>
                            <NakedTitleBar />
                            <AcceptTermsView />
                        </Route>
                        <Route path={locations.activate.path}>
                            <NakedTitleBar />
                            <ActivateAccount />
                        </Route>
                        <Route path={locations.activateTopup.path}>
                            <ActivateAccountTopup />
                        </Route>
                        <Route path={locations.proposals.path}>
                            <TitleBar />
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
                            <TitleBar />
                            <ConnectedView />
                        </Route>
                        <Route path={locations.settings.path}>
                            <TitleBar />
                            <SettingsView />
                        </Route>
                        <Route path={locations.referrals.path}>
                            <TitleBar />
                            <ReferralView />
                        </Route>
                        <Route path={locations.walletTopup.path}>
                            <TitleBar />
                            <TopupView />
                        </Route>
                        <Route path={locations.wallet.path}>
                            <TitleBar />
                            <WalletView />
                        </Route>
                        <Route path={locations.help.path}>
                            <TitleBar />
                            <HelpView />
                        </Route>

                        <Route path={locations.loading.path}>
                            <NakedTitleBar />
                            <LoadingView />
                        </Route>
                    </Switch>
                </Main>
            </WinContents>
        </>
    )
})
