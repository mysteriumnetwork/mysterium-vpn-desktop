/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ConnectionStatus } from "mysterium-vpn-js"
import React, { ButtonHTMLAttributes } from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../store"
import { BrandButton } from "../../ui-kit/mbutton/brand-button"
import { CancelButton } from "../../ui-kit/mbutton/cancel-button"

export type ConnectDisconnectButtonProps = {
    width?: number
    height?: number
}

export const ConnectDisconnectButton: React.FC<ConnectDisconnectButtonProps> = observer(({ width, height }) => {
    const { connection } = useStores()
    const text = ((): string => {
        switch (connection.status) {
            case ConnectionStatus.NOT_CONNECTED:
                return "Connect"
            case ConnectionStatus.CONNECTING:
                return "Cancel"
            case ConnectionStatus.CONNECTED:
                return "Disconnect"
            case ConnectionStatus.DISCONNECTING:
                return "Disconnecting"
        }
        return ""
    })()
    const onClick = async (): Promise<void> => {
        if (connection.status === ConnectionStatus.NOT_CONNECTED) {
            return await connection.connect()
        }
        return await connection.disconnect()
    }
    const isCancel = connection.status !== ConnectionStatus.NOT_CONNECTED
    const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
        disabled: connection.gracePeriod,
        onClick,
    }
    return isCancel ? (
        <CancelButton {...buttonProps}>{text}</CancelButton>
    ) : (
        <BrandButton {...buttonProps}>{text}</BrandButton>
    )
})
