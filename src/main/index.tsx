/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from "path"
import { format as formatUrl } from "url"

import { app, BrowserWindow } from "electron"

import { winSize } from "../config"
import { supervisor } from "../supervisor/supervisor"

const isDevelopment = process.env.NODE_ENV !== "production"

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.supervisor = supervisor

// global reference to win (necessary to prevent window from being garbage collected)
let win: BrowserWindow | null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const installExtensions = async (): Promise<void | any[]> => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const installer = require("electron-devtools-installer")
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ["REACT_DEVELOPER_TOOLS"]

    // eslint-disable-next-line prettier/prettier
    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log); // eslint-disable-line no-console
}

const createWindow = async (): Promise<BrowserWindow> => {
    if (isDevelopment) {
        await installExtensions()
    }

    const window = new BrowserWindow({
        title: "Mysterium VPN",
        width: winSize.width,
        height: winSize.height,
        useContentSize: true,
        resizable: false,
        maximizable: false,
        webPreferences: { nodeIntegration: true },
    })

    if (isDevelopment) {
        window.webContents.once("dom-ready", () => {
            window.webContents.openDevTools()
        })
    }

    if (isDevelopment) {
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

    window.on("closed", () => {
        win = null
    })

    window.webContents.on("devtools-opened", () => {
        window.focus()
        setImmediate(() => {
            window.focus()
        })
    })

    return window
}

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
    win = await createWindow()
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

app.on("will-quit", async () => {
    await supervisor.connect()
    await supervisor.killMyst()
})
