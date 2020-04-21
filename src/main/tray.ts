/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { App, BrowserWindow, Menu, Tray } from "electron"
import { ConnectionStatus } from "mysterium-vpn-js"

import * as packageJson from "../../package.json"
import { staticAssetPath } from "../utils/paths"
import { supervisor } from "../supervisor/supervisor"

import { ipcWebDisconnect } from "./index"

const trayIconPath = (connectionStatus: ConnectionStatus): string => {
    const connected = connectionStatus === ConnectionStatus.CONNECTED
    switch (process.platform) {
        case "darwin":
            return staticAssetPath(`tray/macOS/${connected ? "ActiveTemplate" : "PassiveTemplate"}.png`)
    }
    return staticAssetPath("tray/macOS/PassiveTemplate.png")
}

export const refreshTrayIcon = (tray: Tray, status: ConnectionStatus): void => {
    tray.setImage(trayIconPath(status))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createTray = (app: App, win: BrowserWindow): Tray => {
    const tray = new Tray(trayIconPath(ConnectionStatus.NOT_CONNECTED))
    tray.setContextMenu(
        Menu.buildFromTemplate([
            /*{
                label: "Show window",
                click: (): void => {
                    win.show()
                },
            },*/
            {
                label: "Reinstall",
                click: async (): Promise<void> => {
                    ipcWebDisconnect()
                    await supervisor.install()
                },
            },
            {
                type: "separator",
            },
            {
                role: "quit",
                label: `Quit ${packageJson.productName}`,
                accelerator: "CommandOrControl+Q",
                click: (): void => {
                    app.quit()
                },
            },
        ]),
    )
    return tray
}
