/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { QualityLevel } from "mysterium-vpn-js"
import styled from "styled-components"

import { brandLight } from "../../../ui-kit/colors"

export interface QualityProps {
    level?: QualityLevel
    color?: string
}

const Svg = styled.svg`
    .active & > rect {
        fill: #fff;
    }
`
export const ProposalQuality: React.FC<QualityProps> = ({ level, color = brandLight }) => {
    return (
        <Svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="6" width="3" height="5" rx="1.5" fill={color} opacity={level && level > 0 ? 1 : 0.2} />
            <rect x="5" y="3" width="3" height="8" rx="1.5" fill={color} opacity={level && level >= 1 ? 1 : 0.2} />
            <rect x="10" width="3" height="11" rx="1.5" fill={color} opacity={level && level >= 2 ? 1 : 0.2} />
        </Svg>
    )
}
