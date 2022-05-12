/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ConnectionStatus } from "mysterium-vpn-js"
import React from "react"
import { observer } from "mobx-react-lite"
import toast from "react-hot-toast"

import { useStores } from "../../../store"
import { BrandButton, BrandButtonProps } from "../../../ui-kit/components/Button/BrandButton"
import { CancelButton } from "../../../ui-kit/components/Button/CancelButton"
import { dismissibleToast } from "../../../ui-kit/components/dismissibleToast"

export type ConnectButtonProps = {
    width?: number
    height?: number
}

export const ConnectButton: React.FC<ConnectButtonProps> = observer(function ConnectButton() {
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
            try {
                return await connection.connect()
            } catch (reason) {
                toast.error(
                    dismissibleToast(
                        <span>
                            <>
                                <b>Oops! Could not connect 😶</b>
                                <br />
                                {reason}
                            </>
                        </span>,
                    ),
                )
                return
            }
        }
        return await connection.disconnect()
    }
    const isCancel = connection.status !== ConnectionStatus.NOT_CONNECTED
    const buttonProps: BrandButtonProps = {
        disabled: connection.gracePeriod,
        onClick,
    }
    return isCancel ? (
        <CancelButton {...buttonProps}>{text}</CancelButton>
    ) : (
        <BrandButton {...buttonProps}>{text}</BrandButton>
    )
})
