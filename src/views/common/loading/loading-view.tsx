/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { View } from "@nodegui/react-nodegui"
import React from "react"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"

import { fixAssetPath } from "../../../utils/paths"
import welcomeBg from "../../../ui-kit/assets/welcome-bg.png"
import { Spinner } from "../../../ui-kit/spinner/spinner"

export const LoadingView: React.FC<ViewProps<WidgetEventListeners>> = ({ style, ...rest }) => {
    return (
        <View
            style={`
            background: url("${fixAssetPath(welcomeBg)}") #2e265e;
            background-repeat: none;
            flex-direction: "column";
            justify-content: "center";
            align-items: "center";
            ${style}
            `}
            {...rest}
        >
            <Spinner />
        </View>
    )
}
