/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { View } from "@nodegui/react-nodegui"
import { ClickableView } from "../clickable-view/clickable-view"
import { brand } from "../colors"

const styleSheet = (width: number, height: number): string => `
#active {
    width: ${width};
    height: ${height};
    background: "${brand}";
    border-radius: 3px;
}
#inactive {
    width: ${width};
    height: ${height};
    border-radius: 3px;
}
#inactive:hover {
    background: #e6e6e6;
}
`

export type ToggleProps = {
    width: number
    height: number
    children: React.ReactNode
    onToggle?: () => void
    active: boolean
}

export const Toggle: React.FC<ToggleProps> = ({
    width,
    height,
    children,
    onToggle = (): void => {
        // noop
    },
    active,
}) => {
    return (
        <View id={active ? "active" : "inactive"} styleSheet={styleSheet(width, height)}>
            <ClickableView width={width} height={height} onClick={onToggle}>
                {children}
            </ClickableView>
        </View>
    )
}
