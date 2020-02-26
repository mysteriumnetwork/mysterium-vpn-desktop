import {Button, useEventHandler, View} from "@nodegui/react-nodegui";
import {ConnectionStatus as ConnectionStatusType} from "mysterium-vpn-js/lib/connection/status";
import React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../store";

export const Disconnect = observer(() => {
    const { connection } = useStores()
    const clickHandler = useEventHandler({
        ['clicked']: async () => {
            await connection.disconnect()
        }
    }, [])
    return (
        <View id="connect">
            {connection.status != ConnectionStatusType.NOT_CONNECTED && (
                <Button id="connectBtn" text="Disconnect" on={clickHandler}/>
            )}
        </View>
    )
})
