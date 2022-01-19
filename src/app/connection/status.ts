/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ConnectionStatus } from "mysterium-vpn-js"

export const connectionInProgress = (status: ConnectionStatus): boolean => {
    return [
        ConnectionStatus.CONNECTING,
        ConnectionStatus.CONNECTED,
        ConnectionStatus.ON_HOLD,
        ConnectionStatus.DISCONNECTING,
    ].includes(status)
}

export const connectionActive = (status: ConnectionStatus): boolean => {
    return [ConnectionStatus.CONNECTED, ConnectionStatus.ON_HOLD].includes(status)
}
