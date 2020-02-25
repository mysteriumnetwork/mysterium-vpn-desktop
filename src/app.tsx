import {Button, hot, View, Window} from "@nodegui/react-nodegui";
import React, {MutableRefObject, useCallback, useEffect, useRef} from "react";
import {QIcon, QMainWindow, QStatusBar, WidgetEventTypes} from "@nodegui/nodegui";

import {ConnectionStatus} from "./connection/connection-status";
import mystLogo from "../assets/logo.svg";
import {Logo} from "./logo";
import {useStores} from "./store";
import {autorun} from "mobx";
import {DaemonStatusType} from "./daemon/store";
import {ConnectionStatusType} from "./connection/store";

const minSize = {width: 900, height: 600};
const winIcon = new QIcon(mystLogo);

const mainWindowEventHandler = {
    [WidgetEventTypes.Close]: () => {
        process.exit()
    }
}

const statusBar = new QStatusBar()

const App = () => {
    var winRef: MutableRefObject<QMainWindow | null> = useRef<QMainWindow>(null);
    const setRef = useCallback((ref: QMainWindow) => {
        if (ref !== null) {
            ref.setStatusBar(statusBar)
        }
        winRef.current = ref
    }, [])
    const {daemon, connection, identity} = useStores();
    useEffect(() => autorun(() => {
        const daemonIcon = (daemon.status == DaemonStatusType.Up) ? '🟢' : '⚪️'
        const connectionIcon = (connection.status == ConnectionStatusType.Connected) ? '🟢' : '⚪️'
        statusBar.showMessage(`Connection: ${connectionIcon} | Daemon: ${daemonIcon} | ID: ${identity.id || '⚪'}`, 0)
    }))
    return (
        <Window
            ref={setRef}
            on={mainWindowEventHandler}
            windowIcon={winIcon}
            windowTitle="Mysterium VPN 2"
            minSize={minSize}
            maxSize={minSize}
            styleSheet={styleSheet}
        >
            <View style={containerStyle}>
                <Logo/>
                <ConnectionStatus/>
                <Button text="Connect" on={{
                    ['clicked']: () => {
                        // let qStatusBar = new QStatusBar();
                        // winRef.current.setStatusBar(qStatusBar)
                        // qStatusBar.showMessage(new Date().toString(), 0)
                        // console.log("clicked")
                    }
                }}/>
            </View>
        </Window>
    )
}

const containerStyle = `
    flex: 1;
`;

const styleSheet = `
#welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
}
#step-1, #step-2 {
    font-size: 18px;
    padding-top: 10px;
    padding-horizontal: 20px;
}
`;

export default hot(App);
