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
