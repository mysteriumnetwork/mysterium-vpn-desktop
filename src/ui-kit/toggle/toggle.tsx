/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { useEventHandler, View } from "@nodegui/react-nodegui"
import { WidgetEventTypes } from "@nodegui/nodegui"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"

export interface ToggleProps extends ViewProps<WidgetEventListeners> {
    children: React.ReactNode
    onToggle?: () => void
}

export const Toggle: React.FC<ToggleProps> = ({
    children,
    onToggle = (): void => {
        // noop
    },
    ...rest
}) => {
    const clickHandler = useEventHandler({ [WidgetEventTypes.MouseButtonPress]: () => onToggle() }, [])
    return (
        <View {...rest} on={clickHandler}>
            {children}
        </View>
    )
}
