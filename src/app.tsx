import React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "./store";
import {DaemonStatusType} from "./daemon/store";
import {ConnectView} from "./connect-view";
import {Spinner} from "./ui-kit/spinner/spinner";
import {View} from "@nodegui/react-nodegui";
import {winSize} from "./config";

export const App = observer(() => {
    const {daemon} = useStores()
    if (daemon.status == DaemonStatusType.Down) {
        return (
            <View style={`background: #ecf0f1;`}>
                <Spinner
                    active
                    top={(winSize.height - 200) / 2}
                    left={(winSize.width - 200) / 2}
                />
            </View>
        )
    }
    return <ConnectView/>
})
