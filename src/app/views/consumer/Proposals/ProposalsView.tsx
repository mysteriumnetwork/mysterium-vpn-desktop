/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"

import { locations } from "../../../navigation/locations"
import { useStores } from "../../../store"

import { ManualConnectView } from "./ManualConnectView"
import { QuickConnectView } from "./QuickConnectView"

export const ProposalsView: React.FC = observer(() => {
    const { config } = useStores()
    return (
        <>
            <Switch>
                <Route path={locations.proposalsQuickConnect}>
                    <QuickConnectView />
                </Route>
                <Route path={locations.proposalsManualConnect}>
                    <ManualConnectView />
                </Route>
                <Redirect
                    to={config.quickConnect ? locations.proposalsQuickConnect : locations.proposalsManualConnect}
                />
            </Switch>
        </>
    )
})
