/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { QIcon, QMenu, QSystemTrayIcon } from "@nodegui/nodegui"

import mystLogo from "../../assets/logo.png"
import { fixAssetPath } from "../utils/paths"

import { quitAction } from "./quit"
import { repairAction } from "./repair"

export const createSystemTray = (): void => {
    const tray = new QSystemTrayIcon()
    tray.setIcon(new QIcon(fixAssetPath(mystLogo)))
    const trayMenu = new QMenu()
    trayMenu.addAction(repairAction())
    trayMenu.addSeparator()
    trayMenu.addAction(quitAction())
    tray.setContextMenu(trayMenu)
    tray.show()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).systemTray = tray
}
