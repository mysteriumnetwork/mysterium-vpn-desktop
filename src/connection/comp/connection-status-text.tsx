import React from "react"
import { Text } from "@nodegui/react-nodegui"
import { useStores } from "../../store"
import { observer } from "mobx-react-lite"
import { ConnectionStatus as ConnectionStatusType } from "mysterium-vpn-js"

export const ConnectionStatusText = observer(() => {
    const {
        connection: { status },
    } = useStores()
    let statusText = ""
    switch (status) {
        case ConnectionStatusType.CONNECTED:
            statusText = "🔐 Your connection is secure"
            break
        case ConnectionStatusType.NOT_CONNECTED:
            statusText = "⚠️ Your connection is unprotected"
            break
        default:
            statusText = "Working on it..."
    }
    return (
        <Text
            style={`
            width: 400;
            height: 25;
            qproperty-alignment: 'AlignHCenter';
        `}
        >
            {statusText}
        </Text>
    )
})
