/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BrowserWindow } from "electron"

import { WebIpcListenChannels } from "../shared/ipc"

let win: BrowserWindow

export const initialize = (w: BrowserWindow): void => {
    win = w
}
export const webAnalyticsAppStateEvent = (action: string, name?: string, value?: number): void => {
    win?.webContents.send(WebIpcListenChannels.AnalyticsAppStateEvent, action, name, value)
}

export const webAnalyticsUserEvent = (action: string, name?: string, value?: number): void => {
    win?.webContents.send(WebIpcListenChannels.AnalyticsUserEvent, action, name, value)
}
