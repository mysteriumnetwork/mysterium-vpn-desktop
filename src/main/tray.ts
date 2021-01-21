/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { platform } from "os"

import { App, BrowserWindow, Menu, Tray } from "electron"
import { autoUpdater } from "electron-updater"
import { ConnectionStatus } from "mysterium-vpn-js"

import * as packageJson from "../../package.json"
import { staticAssetPath } from "../utils/paths"
import { supervisor } from "../supervisor"
import { analytics } from "../analytics/analytics-main"
import { Category, TrayAction } from "../analytics/analytics"

import { ipcWebDisconnect } from "./index"

const trayIconPath = (connectionStatus: ConnectionStatus): string => {
    const connected = connectionStatus === ConnectionStatus.CONNECTED
    switch (process.platform) {
        case "darwin":
            return staticAssetPath(`tray/macOS/${connected ? "ActiveTemplate" : "PassiveTemplate"}.png`)
        case "win32":
            return staticAssetPath(`tray/windows/${connected ? "logo-active" : "logo"}.ico`)
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
            {
                label: "Show window",
                click: (): void => {
                    analytics.event(Category.Tray, TrayAction.ShowWindow)
                    win.show()
                },
            },
            {
                type: "separator",
            },
            {
                label: "Check for updates",
                click: async (): Promise<void> => {
                    analytics.event(Category.Tray, TrayAction.CheckForUpdates)
                    await autoUpdater.checkForUpdatesAndNotify()
                },
            },
            {
                label: "Repair supervisor",
                click: async (): Promise<void> => {
                    analytics.event(Category.Tray, TrayAction.Repair)
                    ipcWebDisconnect()
                    await supervisor().install()
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
                    analytics.event(Category.Tray, TrayAction.Quit)
                    app.quit()
                },
            },
        ]),
    )
    tray.on("double-click", () => {
        if (platform() == "win32") {
            analytics.event(Category.Tray, TrayAction.DoubleClick)
            win.show()
        }
    })
    return tray
}
