/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ConnectionStatus } from "mysterium-vpn-js"
import React, { ButtonHTMLAttributes } from "react"
import { observer } from "mobx-react-lite"
import { useToasts } from "react-toast-notifications"

import { useStores } from "../../../store"
import { SecondaryButton } from "../../../ui-kit/components/Button/SecondaryButton"

export type ConnectDisconnectButtonProps = {
    width?: number
    height?: number
}

export const DisconnectButton: React.FC<ConnectDisconnectButtonProps> = observer(() => {
    const { connection } = useStores()
    const { addToast } = useToasts()
    const text = ((): string => {
        switch (connection.status) {
            case ConnectionStatus.NOT_CONNECTED:
                return "Connect"
            case ConnectionStatus.CONNECTING:
                return "Cancel"
            case ConnectionStatus.DISCONNECTING:
                return "Disconnecting"
            case ConnectionStatus.CONNECTED:
                return "Disconnect"
        }
        return ""
    })()
    const onClick = async (): Promise<void> => {
        if (connection.status === ConnectionStatus.NOT_CONNECTED) {
            try {
                return await connection.connect()
            } catch (err) {
                addToast(
                    <span>
                        {`Oops! Couldn't connect.`}
                        <br />
                        Try another provider?
                    </span>,
                    {
                        appearance: "error",
                        autoDismiss: true,
                    },
                )
                return
            }
        }
        return await connection.disconnect()
    }
    const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
        disabled: connection.gracePeriod,
        onClick,
    }
    return <SecondaryButton {...buttonProps}>{text}</SecondaryButton>
})
