/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ipcRenderer } from "electron"

import { MainIpcListenChannels } from "../ipc"

export class SupervisorIPC {
    async connect(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorConnect)
    }
    async install(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorInstall)
    }
    async upgrade(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorUpgrade)
    }
    async disconnect(): Promise<void> {
        return await ipcRenderer.invoke(MainIpcListenChannels.SupervisorDisconnect)
    }
}

export const supervisorIPC = new SupervisorIPC()
