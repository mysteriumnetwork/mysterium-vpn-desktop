import { View } from "@nodegui/react-nodegui"
import { ConnectionStatus } from "mysterium-vpn-js"
import React from "react"
import { observer } from "mobx-react-lite"
import { useStores } from "../../store"
import { MButton } from "../../ui-kit/mbutton/mbutton"

export type ConnectDisconnectButtonProps = {
    width?: number
    height?: number
}

export const ConnectDisconnectButton: React.FC<ConnectDisconnectButtonProps> = observer(({ width, height }) => {
    const { connection } = useStores()
    const text = ((): string => {
        switch (connection.status) {
            case ConnectionStatus.NOT_CONNECTED:
                return "Connect"
            case ConnectionStatus.CONNECTING:
                return "Cancel"
            case ConnectionStatus.CONNECTED:
                return "Disconnect"
            case ConnectionStatus.DISCONNECTING:
                return "Disconnecting"
        }
        return ""
    })()
    const onClick = async (): Promise<void> => {
        if (connection.status === ConnectionStatus.NOT_CONNECTED) {
            return await connection.connect()
        }
        return await connection.disconnect()
    }
    const cancelStyle = connection.status !== ConnectionStatus.NOT_CONNECTED
    return (
        <View>
            <MButton
                text={text}
                onClick={onClick}
                enabled={true}
                width={width}
                height={height}
                cancelStyle={cancelStyle}
            />
        </View>
    )
})
