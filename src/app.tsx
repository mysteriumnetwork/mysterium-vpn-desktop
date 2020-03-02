import React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "./store";
import {DaemonStatusType} from "./daemon/store";
import {ConnectView} from "./connect-view";
import {Splash} from "./splash";

export const App = observer(() => {
    const {daemon} = useStores()
    if (daemon.status == DaemonStatusType.Down) {
        return (
            <Splash/>
        )
    }
    return <ConnectView/>
})

