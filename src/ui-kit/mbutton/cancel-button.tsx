/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Button, useEventHandler } from "@nodegui/react-nodegui"

import { textRegular } from "../typography"

import { CommonButtonProps } from "./props"

export const CancelButton: React.FC<CommonButtonProps> = ({
    onClick,
    enabled = true,
    text = "",
    style = "",
    ...rest
}) => {
    const clickHandler = useEventHandler({ ["clicked"]: () => onClick() }, [])
    const stateStyle = ((): string => {
        if (!enabled) {
            return "background: #ccc; color: #fff;"
        }
        return "background: #fefefe; color: #d93c3c;"
    })()
    return (
        <Button
            style={`
                border-radius: 4;
                ${stateStyle}

                padding: 10;
                padding-left: 16;
                padding-right: 16;
                justify-content: "center";
                align-items: "center";

                font-weight: bold;
                ${textRegular}

                ${style}
            `}
            on={clickHandler}
            enabled={enabled}
            text={text}
            {...rest}
        />
    )
}
