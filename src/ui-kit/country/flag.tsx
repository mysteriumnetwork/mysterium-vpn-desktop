/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Image } from "@nodegui/react-nodegui"
import { AspectRatioMode } from "@nodegui/nodegui"

export type FlagProps = {
    imageBase64: Buffer
    size: number
    style?: string
}

export const Flag: React.FC<FlagProps> = ({ imageBase64, size, style = "" }) => {
    return (
        <Image
            size={{ width: size, height: size }}
            style={`width: ${size}; height: ${size}; ${style}`}
            aspectRatioMode={AspectRatioMode.KeepAspectRatio}
            buffer={imageBase64}
        />
    )
}
