/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export enum WebIpcListenChannels {
    AnalyticsUserEvent = "analytics-user-event",
    AnalyticsAppStateEvent = "analytics-appstate-event",
    Disconnect = "disconnect",
    UpdateAvailable = "update-available",
    UpdateNotAvailable = "update-not-available",
    UpdateDownloading = "update-downloading",
    UpdateDownloadComplete = "update-download-complete",
}

export enum MainIpcListenChannels {
    GetOS = "get-os",
    GetMachineId = "get-machine-id",
    Update = "update",
    ConnectionStatus = "connection-status",
    OpenSupportChat = "open-support-chat",
    MinimizeWindow = "minimize-window",
    CloseWindow = "close-window",
    ExportIdentity = "export-identity",
    ImportIdentityChooseFile = "import-identity-choose-file",
    ImportIdentity = "import-identity",
}

export interface IpcResponse {
    result?: unknown
    error?: string
}
