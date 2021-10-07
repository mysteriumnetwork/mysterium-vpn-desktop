/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export enum WebIpcListenChannels {
    Disconnect = "disconnect",
    UpdateAvailable = "update-available",
    UpdateNotAvailable = "update-not-available",
    UpdateDownloading = "update-downloading",
    UpdateDownloadComplete = "update-download-complete",
}

export enum MainIpcListenChannels {
    GetOS = "get-os",
    GetOSVersion = "get-os-version",
    GetMachineId = "get-machine-id",
    Update = "update",
    ConnectionStatus = "connection-status",
    OpenSupportChat = "open-support-chat",
    OpenCardinityPaymentWindow = "open-cardinity-payment-window",
    MinimizeWindow = "minimize-window",
    CloseWindow = "close-window",
    ExportIdentity = "export-identity",
    ImportIdentityChooseFile = "import-identity-choose-file",
    ImportIdentity = "import-identity",
    PushSubscribe = "push-subscribe-country",
    PushUnsubscribe = "push-unsubscribe",
    SupervisorConnect = "supervisor-connect",
    SupervisorInstall = "supervisor-install",
    SupervisorUpgrade = "supervisor-upgrade",
    SupervisorDisconnect = "supervisor-disconnect",
    KillGhosts = "kill-ghost",
    StartNode = "start-node",
    StopNode = "stop-node",
}

export interface IpcResponse {
    result?: unknown
    error?: string
}
