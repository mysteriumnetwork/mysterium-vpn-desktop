/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { App, BrowserWindow, Menu, Tray } from "electron"

import { staticAssetPath } from "../utils/paths"
import { supervisor } from "../supervisor/supervisor"

import { ipcWebDisconnect } from "./index"

const iconPath = (): string => {
    return staticAssetPath("tray/macOS/ActiveTemplate.png")
}

export const createTray = (app: App, win: BrowserWindow): Tray => {
    const tray = new Tray(iconPath())
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
                label: "Quit Mysterium VPN",
                accelerator: "CommandOrControl+Q",
                click: (): void => {
                    app.quit()
                },
            },
        ]),
    )
    return tray
}
