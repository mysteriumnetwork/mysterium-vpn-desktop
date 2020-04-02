/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { hot, Window } from "@nodegui/react-nodegui"
import { QIcon, WidgetEventTypes } from "@nodegui/nodegui"

import mystLogo from "../assets/logo.svg"

import { winSize } from "./config"
import { App } from "./app"
import { textRegular } from "./ui-kit/typography"

const winIcon = new QIcon(mystLogo)

const mainWindowEventHandler = {
    [WidgetEventTypes.Close]: (): void => {
        process.emit("beforeExit", 0)
    },
}

// const statusBar = new QStatusBar()

const MainWindow: React.FC = () => {
    //const winRef: MutableRefObject<QMainWindow | null> = useRef<QMainWindow>(null)
    // const setRef = useCallback((ref: QMainWindow) => {
    //     if (ref !== null) {
    //         ref.setStatusBar(statusBar)
    //     }
    //     winRef.current = ref
    // }, [])
    // const { daemon, connection, identity } = useStores()
    // useEffect(() =>
    //     autorun(() => {
    //         const daemonIcon = daemon.status == DaemonStatusType.Up ? "🟢" : "⚪️"
    //         const connectionIcon = connection.status == ConnectionStatusType.CONNECTED ? "🟢" : "⚪️"
    //         const id = identity.identity?.id ?? "⚪️"
    //         statusBar.clearMessage()
    //         statusBar.showMessage(`Connection: ${connectionIcon} | Daemon: ${daemonIcon} | ID: ${id}`, 0)
    //     }),
    // )

    return (
        <Window
            // ref={setRef}
            on={mainWindowEventHandler}
            windowIcon={winIcon}
            windowTitle="MysteriumVPN"
            minSize={winSize}
            maxSize={winSize}
            styleSheet={`
            QLabel {
            font-family: "Roboto";
            font-weight: 100;
            ${textRegular}
            color: #000;
            }
            `}
        >
            <App />
        </Window>
    )
}

export default hot(MainWindow)
