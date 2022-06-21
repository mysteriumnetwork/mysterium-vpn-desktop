/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Route, Routes as ReactRoutes, Navigate, useLocation } from "react-router-dom"
import { ConnectionStatus } from "mysterium-vpn-js"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { AcceptTermsView } from "../../../views/common/AcceptTerms/AcceptTermsView"
import { ConnectedView } from "../../../views/consumer/Connected/ConnectedView"
import { WalletView } from "../../../views/consumer/Wallet/WalletView"
import { useStores } from "../../../store"
import { TitleBar } from "../TitleBar/TitleBar"
import { locations } from "../../locations"
import { winSize } from "../../../../config"
import { NakedTitleBar } from "../TitleBar/NakedTitleBar"
import { HelpView } from "../../../views/common/Help/HelpView"
import { SettingsView } from "../../../views/common/Settings/SettingsView"
import { TopupRoutes } from "../../../views/consumer/Topup/TopupRoutes"
import { StartupLoadingView } from "../../../daemon/components/StartupLoadingView/StartupLoadingView"
import { IdentityRegistrationView } from "../../../identity/components/IdentityRegistrationView/IdentityRegistrationView"
import { QuickConnectView } from "../../../views/consumer/Proposals/QuickConnectView"
import { ManualConnectView } from "../../../views/consumer/Proposals/ManualConnectView"
import { Welcome } from "../../../onboarding/components/Welcome/Welcome"
import { IdentitySetup } from "../../../onboarding/components/IdentitySetup/IdentitySetup"
import { IdentityBackup } from "../../../onboarding/components/IdentityBackup/IdentityBackup"
import { InitialTopup } from "../../../onboarding/components/InitialTopup/InitialTopup"
import { HelpContentReportIssue } from "../../../views/common/Help/HelpContentReportIssue"
import { HelpContentTermsAndConditions } from "../../../views/common/Help/HelpContentTermsAndConditions"
import { SettingsFilters } from "../../../views/common/Settings/SettingsFilters"
import { SettingsConnection } from "../../../views/common/Settings/SettingsConnection"
import { SettingsMysteriumId } from "../../../views/common/Settings/SettingsMysteriumId"
import { Step1 } from "../../../onboarding/components/IntroductionSteps/Step1"
import { Step2 } from "../../../onboarding/components/IntroductionSteps/Step2"
import { Step3 } from "../../../onboarding/components/IntroductionSteps/Step3"
import { Step4 } from "../../../onboarding/components/IntroductionSteps/Step4"
import { IdentityUpgradeView } from "../../../identity/components/IdentityUpgradeView/IdentityUpgradeView"

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

export const Routes: React.FC = observer(function Routes() {
    const { connection, config } = useStores()
    const location = useLocation()
    const nakedTitleBar = [
        locations.onboarding,
        locations.terms,
        locations.idRegistering,
        locations.idUpgrading,
        locations.loading,
    ].find((p) => location.pathname.startsWith(p))
    return (
        <WinContents>
            <Main>
                {nakedTitleBar ? <NakedTitleBar /> : <TitleBar />}
                <ReactRoutes>
                    <Route path="/loading" element={<StartupLoadingView />} />
                    <Route path="/onboarding/*">
                        <Route path="welcome" element={<Welcome />} />
                        <Route path="intro/*">
                            <Route path="*" element={<Step1 />} />
                            <Route path="2" element={<Step2 />} />
                            <Route path="3" element={<Step3 />} />
                            <Route path="4" element={<Step4 />} />
                        </Route>
                        <Route path="identity/setup" element={<IdentitySetup />} />
                        <Route path="identity/backup" element={<IdentityBackup />} />
                        <Route path="topup-prompt" element={<InitialTopup />} />
                        <Route path="wallet/topup/*" element={<TopupRoutes />} />
                        <Route path="*" element={<Navigate replace to="welcome" />} />
                    </Route>
                    <Route path="/terms" element={<AcceptTermsView />} />
                    <Route path="/registration" element={<IdentityRegistrationView />} />
                    <Route path="/id-upgrade" element={<IdentityUpgradeView />} />
                    <Route
                        path="/consumer"
                        element={
                            <Navigate
                                to={
                                    connection.status === ConnectionStatus.NOT_CONNECTED
                                        ? locations.proposals
                                        : locations.connection
                                }
                            />
                        }
                    />
                    <Route path="/consumer/proposals/*">
                        <Route path="quick-connect" element={<QuickConnectView />} />
                        <Route path="manual-connect" element={<ManualConnectView />} />
                        <Route
                            path="*"
                            element={<Navigate replace to={config.quickConnect ? "quick-connect" : "manual-connect"} />}
                        />
                    </Route>
                    <Route path="/consumer/connection" element={<ConnectedView />} />
                    <Route path="/settings/*" element={<SettingsView />}>
                        <Route path="filters" element={<SettingsFilters />} />
                        <Route path="connection" element={<SettingsConnection />} />
                        <Route path="mysterium-id" element={<SettingsMysteriumId />} />
                        <Route path="*" element={<Navigate replace to="filters" />} />
                    </Route>
                    <Route path="/wallet" element={<WalletView />} />
                    <Route path="/wallet/topup/*" element={<TopupRoutes />} />
                    <Route path="/help/*" element={<HelpView />}>
                        <Route path="bug-report" element={<HelpContentReportIssue />} />
                        <Route path="terms-and-conditions" element={<HelpContentTermsAndConditions />} />
                        <Route path="*" element={<Navigate to="bug-report" />} />
                    </Route>
                    <Route path="*" element={<Navigate replace to="/loading" />} />
                </ReactRoutes>
            </Main>
        </WinContents>
    )
})
