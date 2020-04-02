/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { View } from "@nodegui/react-nodegui"

export type VSpacerProps = {
    x?: number
    y?: number
}

export const Space: React.FC<VSpacerProps> = ({ x = 0, y = 0 }) => <View style={`width: ${x}; height: ${y};`} />
