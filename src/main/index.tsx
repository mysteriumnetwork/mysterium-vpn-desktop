/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from "path"
import { format as formatUrl } from "url"

import { app, BrowserWindow, ipcMain, IpcMainEvent, Menu, Tray } from "electron"
import { autoUpdater } from "electron-updater"

import * as packageJson from "../../package.json"
import { winSize, winSizeExt } from "../config"
import { supervisor } from "../supervisor/supervisor"
import {
    initialize as initializeAnalytics,
    setupApp as setupAnalyticsForApp,
    setupGlobals as setupAnalyticsGlobals,
    setupWindow as setupAnalyticsForWindow,
} from "../analytics/analytics-main"
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

// global reference to win (necessary to prevent window from being garbage collected)
let win: BrowserWindow | null

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let tray: Tray | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installExtensions = async (): Promise<void | any[]> => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const installer = require("electron-devtools-installer")
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ["REACT_DEVELOPER_TOOLS"]

    // eslint-disable-next-line prettier/prettier
    return Promise.all(extensions.map((name) => installer.default(installer[name], forceDownload))).catch(log.debug) // eslint-disable-line no-console
}

const createWindow = async (): Promise<BrowserWindow> => {
    if (isDevelopment()) {
        await installExtensions()
    }

    const window = new BrowserWindow({
        title: packageJson.productName,
        width: winSize.width,
        height: winSize.height,
        useContentSize: true,
        resizable: false,
        maximizable: false,
        backgroundColor: "#882f61",
        webPreferences: {
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
            win = null
        } else {
            event.preventDefault()
            win?.hide()
        }
    })
    window.on("closed", () => {
        win = null
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
    setupAnalyticsForWindow(window)

    return window
}

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
    win = await createWindow()
    tray = createTray(app, win)
    initializeAnalytics()
    setupAnalyticsGlobals()
    setupAnalyticsForApp(app)
    autoUpdater.checkForUpdatesAndNotify()
})

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", async () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (win === null) {
        win = await createWindow()
    }
})

app.on("before-quit", () => (app.quitting = true))

app.on("will-quit", async () => {
    await supervisor.connect()
    supervisor.killMyst()
})

ipcMain.on(MainIpcListenChannels.ConnectionStatus, (event, status) => {
    if (!tray || !status) {
        return
    }
    refreshTrayIcon(tray, status)
})
ipcMain.on(MainIpcListenChannels.ToggleSupportChat, (event: IpcMainEvent, open: boolean) => {
    if (open) {
        win?.setContentSize(winSizeExt.width, winSizeExt.height, true)
    } else {
        win?.setContentSize(winSize.width, winSize.height, true)
    }
})

export const ipcWebDisconnect = (): void => {
    win?.webContents.send(WebIpcListenChannels.Disconnect)
}
