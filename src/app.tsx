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

export const App = observer(() => {
    const { daemon, connection, identity } = useStores()
    if (daemon.status == DaemonStatusType.Down) {
        return (
            <View style={`background: #ecf0f1;`}>
                <Spinner active top={(winSize.height - 200) / 2} left={(winSize.width - 200) / 2} />
            </View>
        )
    }
    if (!identity.identity || identity.identity.registrationStatus !== IdentityRegistrationStatus.RegisteredConsumer) {
        return <SelectIdentityView />
    }
    if (connection.status === ConnectionStatus.NOT_CONNECTED) {
        return <SelectProposalView />
    }
    return <ConnectedView />
})
