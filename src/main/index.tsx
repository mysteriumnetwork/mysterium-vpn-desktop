/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from "path"
import { format as formatUrl } from "url"
import * as os from "os"

import { app, BrowserWindow, ipcMain, IpcMainEvent, Menu, Tray } from "electron"
import { autoUpdater } from "electron-updater"
import { machineIdSync } from "node-machine-id"

import * as packageJson from "../../package.json"
import { winSize } from "../config"
import { initialize as initializeSentry } from "../shared/errors/sentry"
import { log } from "../shared/log/log"
import { isDevelopment } from "../utils/env"
import { MainIpcListenChannels, WebIpcListenChannels } from "../shared/ipc"
import { handleProcessExit } from "../utils/handle-process-exit"

import { initialize as initializePushNotifications } from "./push/push"
import { createTray, refreshTrayIcon } from "./tray"
import { initialize as initializeAnalytics } from "./analytics-main"
import { supervisor } from "./node/supervisor"
import { createMenu } from "./menu"
import { mysteriumNode } from "./node/mysterium-node"

initializeSentry()

autoUpdater.logger = log
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
autoUpdater.logger.transports.file.level = "info"

// global reference to win (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

export const getMainWindow = (): BrowserWindow | null => {
    return mainWindow
}

let chatWindow: BrowserWindow | null

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let tray: Tray | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installExtensions = async (): Promise<void | any[]> => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer")
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = [REACT_DEVELOPER_TOOLS]

    // eslint-disable-next-line prettier/prettier
    return Promise.all(extensions.map((extension) => installExtension(extension, forceDownload))).catch((e) => log.debug(e)) // eslint-disable-line no-console
}

const appInstanceLock = app.requestSingleInstanceLock()

const createMainWindow = async (): Promise<BrowserWindow> => {
    if (isDevelopment()) {
        await installExtensions()
    }

    const window = new BrowserWindow({
        title: packageJson.productName,
        width: winSize.width,
        height: winSize.height,
        frame: false,
        titleBarStyle: "hidden",
        trafficLightPosition: { x: 12, y: 11 },
        useContentSize: true,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        backgroundColor: "#882f61",
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nativeWindowOpen: true,
        },
    })
    window.setMenuBarVisibility(false)
    if (!isDevelopment()) {
        Menu.setApplicationMenu(createMenu())
    }
    initializeAnalytics(window)

    if (isDevelopment()) {
        window.webContents.once("dom-ready", () => {
            window.webContents.openDevTools({ mode: "detach" })
        })
    }

    if (isDevelopment()) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    } else {
        window.loadURL(
            formatUrl({
                pathname: path.join(__dirname, "index.html"),
                protocol: "file",
                slashes: true,
            }),
        )
    }

    window.on("close", (event) => {
        if (app.quitting) {
            mainWindow = null
        } else {
            event.preventDefault()
            mainWindow?.hide()
        }
    })
    window.on("closed", () => {
        mainWindow = null
    })

    window.webContents.on("devtools-opened", () => {
        window.focus()
        setImmediate(() => {
            window.focus()
        })
    })
    window.webContents.on("did-finish-load", () => {
        initializePushNotifications()
    })

    return window
}

const createChatWindow = async (id: string): Promise<BrowserWindow> => {
    chatWindow = new BrowserWindow({
        frame: true,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        width: winSize.width,
        height: winSize.height,
        x: (mainWindow?.getBounds().x ?? 0) + 40,
        y: mainWindow?.getBounds().y,
    })
    chatWindow.removeMenu()
    chatWindow.on("close", (event) => {
        if (app.quitting) {
            chatWindow = null
        } else {
            event.preventDefault()
            chatWindow?.hide()
        }
    })
    chatWindow.on("closed", () => {
        chatWindow = null
    })

    const url = formatUrl({
        pathname: path.join(__static, "support.html"),
        query: {
            app_id: packageJson.intercomAppId,
            node_identity: id,
            app_version: packageJson.version,
        },
        protocol: "file",
        slashes: true,
    })
    await chatWindow.loadURL(url)
    return chatWindow
}

if (!appInstanceLock) {
    app.quit()
} else {
    app.on("second-instance", async () => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.show()
        }
    })

    // create main BrowserWindow when electron is ready
    app.on("ready", async () => {
        mainWindow = await createMainWindow()
        tray = createTray(app, mainWindow)
    })
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.whenReady().then(() => {
    app.on("activate", async () => {
        // on macOS it is common to re-create a window even after all windows have been closed
        if (mainWindow == null) {
            mainWindow = await createMainWindow()
        }
        mainWindow.show()
    })
})

app.on("before-quit", async () => {
    app.quitting = true
    await mysteriumNode.stop()
    await supervisor.disconnect()
})

ipcMain.handle(MainIpcListenChannels.GetOS, (): Promise<string> => {
    return Promise.resolve(os.platform())
})

ipcMain.handle(MainIpcListenChannels.GetMachineId, (): Promise<string> => {
    const machineId = machineIdSync()
    log.info("Resolved machine ID", machineId)
    return Promise.resolve(machineId)
})

ipcMain.on(MainIpcListenChannels.ConnectionStatus, (event, status) => {
    if (!tray || !status) {
        return
    }
    refreshTrayIcon(tray, status)
})
ipcMain.on(MainIpcListenChannels.OpenSupportChat, async (event: IpcMainEvent, id: string) => {
    if (chatWindow == null) {
        chatWindow = await createChatWindow(id)
    }
    chatWindow.show()
})

ipcMain.on(MainIpcListenChannels.Update, () => {
    autoUpdater.checkForUpdates()
})
ipcMain.on(MainIpcListenChannels.MinimizeWindow, () => {
    mainWindow?.minimize()
})
ipcMain.on(MainIpcListenChannels.CloseWindow, () => {
    mainWindow?.close()
})

supervisor.registerIPC()
mysteriumNode.registerIPC(getMainWindow)

autoUpdater.on("download-progress", () => {
    mainWindow?.webContents.send(WebIpcListenChannels.UpdateDownloading)
})

autoUpdater.on("update-available", () => {
    mainWindow?.webContents.send(WebIpcListenChannels.UpdateAvailable)
})

autoUpdater.on("update-not-available", () => {
    mainWindow?.webContents.send(WebIpcListenChannels.UpdateNotAvailable)
})

autoUpdater.on("update-downloaded", () => {
    mainWindow?.webContents.send(WebIpcListenChannels.UpdateDownloadComplete)
    setTimeout(() => {
        autoUpdater.quitAndInstall(false, true)
    }, 1_000)
})

export const ipcWebDisconnect = (): void => {
    mainWindow?.webContents.send(WebIpcListenChannels.Disconnect)
}

handleProcessExit()
