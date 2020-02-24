import React from "react";
import {Text, View} from "@nodegui/react-nodegui"
import {useStores} from "../store";
import {observer} from "mobx-react-lite";

export const ConnectionStatus = observer(() => {
    const {connection: {status}} = useStores()
    return (
        <View id="status" styleSheet={style}>
            <Text id="statusText">{status}</Text>
        </View>
    )
})

const style = `
#statusText {
    font-size: 16px;
    qproperty-alignment: 'AlignHCenter';
}
`;
