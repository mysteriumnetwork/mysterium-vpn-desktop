/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Button, useEventHandler } from "@nodegui/react-nodegui"

import { brand } from "../colors"
import { textRegular } from "../typography"

export type MButtonProps = {
    text: string
    enabled?: boolean
    onClick: () => void
    width?: number
    height?: number
    cancelStyle?: boolean
}

export const MButton: React.FC<MButtonProps> = ({
    text,
    enabled = true,
    onClick,
    width,
    height,
    cancelStyle = false,
}) => {
    const clickHandler = useEventHandler({ ["clicked"]: () => onClick() }, [])
    const stateStyle = ((): string => {
        if (!enabled) {
            return "background: #ddd; color: #fff;"
        }
        if (cancelStyle) {
            return "background: #fefefe; color: #d93c3c;"
        }
        return `background: ${brand}; color: #fefefe;`
    })()
    return (
        <Button
            enabled={enabled}
            style={`
                ${textRegular} 
                padding: 10;
                justify-content: "center";
                align-items: "center";
                font-weight: bold; 
                ${stateStyle}
                border-radius: 3;
                ${width ? `width: ${width};` : ""}
                ${height ? `height: ${height};` : ""}
            `}
            text={text}
            on={clickHandler}
        />
    )
}
