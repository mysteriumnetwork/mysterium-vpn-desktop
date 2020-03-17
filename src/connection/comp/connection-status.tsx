/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { View } from "@nodegui/react-nodegui"
import { useStores } from "../../store"
import { observer } from "mobx-react-lite"
import { Spinner } from "../../ui-kit/spinner/spinner"
import { ConnectionStatus as ConnectionStatusType } from "mysterium-vpn-js"

export const ConnectionStatus = observer(() => {
    const {
        connection: { status },
    } = useStores()
    const spin = [ConnectionStatusType.CONNECTING, ConnectionStatusType.DISCONNECTING].includes(status)
    return (
        <View style={`flex-direction: "column";`}>
            <View style={`width: 200; height: 200;`}>
                <Spinner active={spin} top={0} left={0} />
            </View>
        </View>
    )
})
