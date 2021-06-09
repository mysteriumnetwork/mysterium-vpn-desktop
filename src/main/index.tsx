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

import * as packageJson from "../../package.json"
import { winSize, winSizeExt } from "../config"
import { supervisor } from "../supervisor/supervisor"
import { initialize as initializeAnalytics } from "../analytics/analytics-main"
import { initialize as initializePushNotifications } from "../push/push"
import { initialize as initializeSentry } from "../errors/sentry"
import { log } from "../log/log"
import { isDevelopment } from "../utils/env"

import { createTray, refreshTrayIcon } from "./tray"
import { MainIpcListenChannels, WebIpcListenChannels } from "./ipc"
import { createMenu } from "./menu"

initializeSentry()

autoUpdater.logger = log
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
autoUpdater.logger.transports.file.level = "info"

global.supervisor = supervisor
global.os = os.platform()

// global reference to win (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

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
        frame: os.platform() == "darwin" ? false : true,
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
            enableRemoteModule: true,
        },
    })
    window.setMenuBarVisibility(false)
    if (!isDevelopment()) {
        Menu.setApplicationMenu(createMenu())
    }

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
    initializeAnalytics(window)

    return window
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
    await supervisor.connect()
    await supervisor.stopMyst()
})

ipcMain.on(MainIpcListenChannels.ConnectionStatus, (event, status) => {
    if (!tray || !status) {
        return
    }
    refreshTrayIcon(tray, status)
})
ipcMain.on(MainIpcListenChannels.ToggleSupportChat, (event: IpcMainEvent, open: boolean) => {
    if (open) {
        mainWindow?.setContentSize(winSizeExt.width, winSizeExt.height, true)
    } else {
        mainWindow?.setContentSize(winSize.width, winSize.height, true)
    }
})
ipcMain.on(MainIpcListenChannels.Update, () => {
    autoUpdater.checkForUpdates()
})

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
