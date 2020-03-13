import { View } from "@nodegui/react-nodegui"
import { ConnectionStatus as ConnectionStatusType } from "mysterium-vpn-js"
import React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../store"
import { MButton } from "../../ui-kit/mbutton/mbutton"

export const ConnectDisconnectButton = observer(() => {
    const { connection } = useStores()
    const connect = async (): Promise<void> => {
        await connection.connect()
    }
    const disconnect = async (): Promise<void> => {
        await connection.disconnect()
    }
    return (
        <View>
            {connection.status !== ConnectionStatusType.CONNECTED && (
                <MButton
                    text="Connect"
                    onClick={connect}
                    enabled={connection.status === ConnectionStatusType.NOT_CONNECTED}
                />
            )}
            {connection.status === ConnectionStatusType.CONNECTED && (
                <MButton
                    text="Disconnect"
                    onClick={disconnect}
                    enabled={connection.status === ConnectionStatusType.CONNECTED}
                />
            )}
        </View>
    )
})
