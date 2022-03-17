/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ConnectionStatus } from "mysterium-vpn-js"
import React, { ButtonHTMLAttributes } from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"
import { SecondaryButton } from "../../../ui-kit/components/Button/SecondaryButton"

export const DisconnectButton = observer(function DisconnectButton() {
    const { connection } = useStores()
    const text = ((): string => {
        switch (connection.status) {
            case ConnectionStatus.NOT_CONNECTED:
                return "Connect"
            case ConnectionStatus.CONNECTING:
                return "Cancel"
            case ConnectionStatus.CONNECTED:
            case ConnectionStatus.ON_HOLD:
                return "Disconnect"
            case ConnectionStatus.DISCONNECTING:
                return "Disconnecting"
        }
        return ""
    })()
    const onClick = async (): Promise<void> => {
        return await connection.disconnect()
    }
    const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
        disabled: connection.gracePeriod,
        onClick,
    }
    return <SecondaryButton {...buttonProps}>{text}</SecondaryButton>
})
