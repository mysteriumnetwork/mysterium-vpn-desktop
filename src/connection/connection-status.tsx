import React from "react";
import {Text, View} from "@nodegui/react-nodegui"
import {useStores} from "../store";
import {observer} from "mobx-react-lite";
import {Spinner} from "../ui-kit/spinner/spinner";
import {ConnectionStatus as ConnectionStatusType} from "mysterium-vpn-js/lib/connection/status";

export const ConnectionStatus = observer(() => {
    const {connection: {status}} = useStores()
    const spin = [ConnectionStatusType.CONNECTING, ConnectionStatusType.DISCONNECTING].includes(status)
    return (
        <View id="container" styleSheet={style}>
            <View style={`width: 200; height: 200`}>
                <Spinner active={spin} top={0} left={0}/>
            </View>
            <Text id="text">{status}</Text>
        </View>
    )
})

const style = `
#container {
    flex-direction: "column";
}
#text {
    font-size: 16px;
    qproperty-alignment: 'AlignHCenter';
}
`;
