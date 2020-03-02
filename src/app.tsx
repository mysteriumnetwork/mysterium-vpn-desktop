import {hot, View, Window, ScrollArea} from "@nodegui/react-nodegui";
import React, {MutableRefObject, useCallback, useEffect, useRef} from "react";
import {QIcon, QMainWindow, QStatusBar, WidgetEventTypes} from "@nodegui/nodegui";

import {ConnectionStatus} from "./connection/connection-status";
import {ConnectionStatus as ConnectionStatusType} from "mysterium-vpn-js"
import mystLogo from "../assets/logo.svg";
import {Logo} from "./logo";
import {useStores} from "./store";
import {autorun} from "mobx";
import {DaemonStatusType} from "./daemon/store";
import {Proposals} from "./proposals/proposals";
import {Disconnect} from "./connection/disconnect-button";

const minSize = {width: 900, height: 600};
const winIcon = new QIcon(mystLogo);

const mainWindowEventHandler = {
    [WidgetEventTypes.Close]: () => {
        process.emit("beforeExit", 0)
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
        const connectionIcon = (connection.status == ConnectionStatusType.CONNECTED) ? '🟢' : '⚪️'
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
            <View id="main">
                <View id="left">
                    <ScrollArea id="scroll">
                        <Proposals/>
                    </ScrollArea>
                </View>
                <View id="right">
                    <Logo/>
                    <ConnectionStatus/>
                    <Disconnect/>
                </View>
            </View>
        </Window>
    )
}

//     background-color: QLinearGradient( x1: 0, y1: 0, x2: 1, y2: 0, stop: 0 #412361, stop: 1 #9b1c4d);

const styleSheet = `
#main {
    width: ${minSize.width}px;
    height: ${minSize.height}px;
    background: "white";
    flex-direction: "row";
}
#left {
    width: 410px;
    background-color: #fafafa;
}
#right {
    flex: 1;
    flex-direction: column;
    align-items: "center";
    padding-top: 120px;
    background-color: #f0f0f0;
}
#scroll {
    width: 410px;
}
#connect {
    margin-top: 30px;
}
#connectBtn {
    padding: 18px;
}
`;

export default hot(App);
