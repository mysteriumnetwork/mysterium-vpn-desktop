/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { useEventHandler, View } from "@nodegui/react-nodegui"
import { WidgetEventTypes } from "@nodegui/nodegui"

export type ToggleProps = {
    children: React.ReactNode
    onToggle?: () => void
    id: string
}

export const Toggle: React.FC<ToggleProps> = ({
    children,
    onToggle = (): void => {
        // noop
    },
    id = "",
}) => {
    const clickHandler = useEventHandler({ [WidgetEventTypes.MouseButtonPress]: () => onToggle() }, [])
    return (
        <View id={id} on={clickHandler}>
            {children}
        </View>
    )
}
