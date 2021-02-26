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
    Update = "update",
    ConnectionStatus = "connection-status",
    ToggleSupportChat = "open-support-chat",
}
