import {QIcon, QMenu, QSystemTrayIcon} from "@nodegui/nodegui";
import path from "path";
import {quitAction} from "./quit";

export const createSystemTray = () => {
    const tray = new QSystemTrayIcon()
    tray.setIcon(new QIcon(path.resolve(__dirname, "../assets/logo.png")))
    const trayMenu = new QMenu();
    trayMenu.addAction(quitAction())
    tray.setContextMenu(trayMenu)
    tray.show()

    {
        (global as any).systemTray = tray
    }
}
