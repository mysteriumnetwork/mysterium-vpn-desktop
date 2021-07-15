/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import QRCode from "qrcode.react"

export interface QRProps {
    text?: string
    size?: number
}

export const QR: React.FC<QRProps> = ({ text, size = 128 }) => {
    if (!text) {
        return <></>
    }
    return (
        <div style={{ width: size, height: size }}>
            <QRCode value={text} size={size} renderAs="svg" />
        </div>
    )
}
