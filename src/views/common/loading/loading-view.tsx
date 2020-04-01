/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { View } from "@nodegui/react-nodegui"
import React, { MutableRefObject, useCallback, useEffect, useRef } from "react"
import { RNView, ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"
import { QLabel, QMovie } from "@nodegui/nodegui"

import { fixAssetPath } from "../../../utils/paths"
import welcomeBg from "../../../ui-kit/assets/welcome-bg.png"

// Loading.io Free License
// With Loading.io Free license ( LD-FREE / FREE / Free License ),
// items are dedicated to the public domain by waiving all our right worldwide under copyright law.
// You can use items under LD-FREE freely for any purpose. No attribution is required.
import spinnerFile from "./Bars-1s-50px.gif"

const spinnerSize = {
    width: 50,
    height: 50,
}

const mov = new QMovie()
mov.setFileName(fixAssetPath(spinnerFile))

let ql: QLabel

export const LoadingView: React.FC<ViewProps<WidgetEventListeners>> = ({ style, ...rest }) => {
    const viewRef: MutableRefObject<RNView | null> = useRef<RNView>(null)
    const setViewRef = useCallback((ref: RNView) => {
        viewRef.current = ref
        if (viewRef.current) {
            ql = new QLabel(viewRef.current)
            ql.setFixedSize(spinnerSize.width, spinnerSize.height)
            ql.lower()
            ql.setMovie(mov)
            ql.hide()
        }
    }, [])
    useEffect(() => {
        if (!viewRef) {
            return
        }
        mov.start()
        ql.show()
    }, [viewRef])
    return (
        <View
            style={`
            background: "red";
            background: url("${fixAssetPath(welcomeBg)}") #2e265e;
            background-repeat: none;
            flex-direction: "column";
            justify-content: "center";
            align-items: "center";
            ${style}
            `}
            {...rest}
        >
            <View
                ref={setViewRef}
                style={`
                width: 50;
                height: 50;
                top: 0;
                left: 0;
                `}
            />
        </View>
    )
}
