/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { brand } from "../../colors"

export const StepProgressBar: React.FC<{ step: number }> = ({ step }) => {
    let barWidth = 36
    if (step > 2) {
        barWidth = 212
    } else if (step > 1) {
        barWidth = 172
    } else if (step > 0) {
        barWidth = 106
    }
    return (
        <svg width="212" height="14" viewBox="0 0 212 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.2">
                <rect x="7" y="6" width="199" height="2" fill="white" />
                <circle cx="73" cy="7" r="7" fill="white" />
                <circle cx="139" cy="7" r="7" fill="white" />
                <circle cx="205" cy="7" r="7" fill="white" />
            </g>
            <rect x="4" y="6" width={barWidth} height="2" fill={brand} />
            <circle cx="7" cy="7" r="7" fill={brand} />
            <circle cx="7" cy="7" r="3" fill="white" />
            <circle cx="73" cy="7" r="7" fill={step > 0 ? brand : "transparent"} />
            <circle cx="73" cy="7" r="3" fill={step > 0 ? "#fff" : "transparent"} />
            <circle cx="139" cy="7" r="7" fill={step > 1 ? brand : "transparent"} />
            <circle cx="139" cy="7" r="3" fill={step > 1 ? "#fff" : "transparent"} />
            <circle cx="205" cy="7" r="7" fill={step > 2 ? brand : "transparent"} />
            <circle cx="205" cy="7" r="3" fill={step > 2 ? "#fff" : "transparent"} />
        </svg>
    )
}
