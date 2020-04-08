/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from "react"
import { Image } from "@nodegui/react-nodegui"
import * as _ from "lodash"
import { AspectRatioMode } from "@nodegui/nodegui"
import qrcode from "qrcode-generator"

export interface QRProps {
    text: string
    size?: number
}

export const QR: React.FC<QRProps> = ({ text, size = 100 }) => {
    const [qrBase64, setQrBase64] = useState("")
    useEffect(() => {
        const qr = qrcode(0, "L")
        qr.addData(text)
        qr.make()
        setQrBase64(_.trimStart(qr.createDataURL(), "data:image/gif;base64,"))
    })
    if (!qrBase64) {
        return <></>
    }
    return (
        <Image
            size={{ width: size, height: size }}
            style={`width: ${size}; height: ${size}; min-width: ${size}; min-height: ${size};`}
            aspectRatioMode={AspectRatioMode.KeepAspectRatio}
            buffer={Buffer.from(qrBase64, "base64")}
        />
    )
}
