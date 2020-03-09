import { QIcon, QMenu, QSystemTrayIcon } from "@nodegui/nodegui"
import path from "path"
import { quitAction } from "./quit"
import { repairAction } from "./repair"

export const createSystemTray = (): void => {
    const tray = new QSystemTrayIcon()
    tray.setIcon(new QIcon(path.resolve(__dirname, "../assets/logo.png")))
    const trayMenu = new QMenu()
    trayMenu.addAction(repairAction())
    trayMenu.addSeparator()
    trayMenu.addAction(quitAction())
    tray.setContextMenu(trayMenu)
    tray.show()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(global as any).systemTray = tray
}
