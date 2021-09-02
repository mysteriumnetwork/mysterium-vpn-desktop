/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ipcRenderer } from "electron"

import { IpcResponse, MainIpcListenChannels } from "../ipc"

export class MysteriumNodeIPC {
    start(): Promise<void> {
        return ipcRenderer.invoke(MainIpcListenChannels.StartNode)
    }
    stop(): Promise<void> {
        return ipcRenderer.invoke(MainIpcListenChannels.StopNode)
    }
    killGhosts(): Promise<void> {
        return ipcRenderer.invoke(MainIpcListenChannels.KillGhosts)
    }
    importIdentity(opts: ImportIdentityOpts): Promise<IpcResponse> {
        return ipcRenderer.invoke(MainIpcListenChannels.ImportIdentity, opts)
    }
    importIdentityChooseFile(): Promise<string> {
        return ipcRenderer
            .invoke(MainIpcListenChannels.ImportIdentityChooseFile)
            .then((result: IpcResponse) => result.result as string)
    }
    exportIdentity(opts: ExportIdentityOpts): Promise<IpcResponse> {
        return ipcRenderer.invoke(MainIpcListenChannels.ExportIdentity, opts)
    }
}

export interface ImportIdentityOpts {
    filename: string
    passphrase: string
}

export interface ExportIdentityOpts {
    id: string
    passphrase: string
}

export const mysteriumNodeIPC = new MysteriumNodeIPC()
