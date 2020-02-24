import React from "react";
import {View, Text} from "@nodegui/react-nodegui"

type ConnectionStatus = 'Connecting' | 'Connected' | 'Disconnecting' | 'Disconnected'
type StatusProps = {
    status: ConnectionStatus
}

export const ConnectionStatus: React.FC<StatusProps> = props => {
    const {status} = props
    return (
        <View id="status" styleSheet={style}>
            <Text id="statusText">{status}</Text>
        </View>
    )
}

const style = `
#statusText {
    font-size: 16px;
    qproperty-alignment: 'AlignHCenter';
}
`
