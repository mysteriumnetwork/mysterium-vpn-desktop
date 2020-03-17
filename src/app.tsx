/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "./store"
import { DaemonStatusType } from "./daemon/store"
import { ConnectView } from "./connect-view"
import { Spinner } from "./ui-kit/spinner/spinner"
import { View } from "@nodegui/react-nodegui"
import { winSize } from "./config"
import { ConnectionStatus } from "mysterium-vpn-js"
import { ConnectionActiveView } from "./connection-active-view"

export const App = observer(() => {
    const { daemon, connection } = useStores()
    if (daemon.status == DaemonStatusType.Down) {
        return (
            <View style={`background: #ecf0f1;`}>
                <Spinner active top={(winSize.height - 200) / 2} left={(winSize.width - 200) / 2} />
            </View>
        )
    }
    if (connection.status === ConnectionStatus.NOT_CONNECTED) {
        return <ConnectView />
    }
    return <ConnectionActiveView />
})
