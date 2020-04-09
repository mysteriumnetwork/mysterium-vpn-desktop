/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"
import { LineEdit, Text, useEventHandler, View } from "@nodegui/react-nodegui"
import React, { useCallback } from "react"
import { RNText } from "@nodegui/react-nodegui/dist/components/Text/RNText"

const glassX = 25

export interface SearchProps extends ViewProps<WidgetEventListeners> {
    width: number
    height: number
    onChange: (text?: string) => void
}

export const Search: React.FC<SearchProps> = ({ width, height, onChange, style = "", ...rest }) => {
    const setSearchGlassRef = useCallback((searchGlass: RNText) => {
        if (searchGlass) {
            searchGlass.raise()
        }
    }, [])
    const lineEditListener = useEventHandler(
        {
            textChanged: (text: string) => onChange(text),
        },
        [],
    )
    const editX = width - glassX
    return (
        <View
            style={`
            height: ${height};
            width: ${width};
            ${style}
            `}
            {...rest}
        >
            <Text
                ref={setSearchGlassRef}
                style={`
                left: 4;
                width: ${glassX};
                `}
            >{`🔍`}</Text>
            <LineEdit
                style={`
                left: -${glassX};
                width: ${editX};
                min-width: ${editX};
                max-width: ${editX};
                height: ${height};
                min-height: ${height};
                padding-left: ${glassX};
                border-radius: 4;
                background: #e7e7e7;
                `}
                placeholderText="Search..."
                on={lineEditListener}
            />
        </View>
    )
}
