/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export enum WebIpcListenChannels {
    Disconnect = "disconnect",
}

export enum MainIpcListenChannels {
    ConnectionStatus = "connection-status",
    ToggleSupportChat = "open-support-chat",
}
