/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconSent: React.FC<IconProps> = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10 -8.09356e-07C15.5228 -3.62361e-07 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 4.22777e-07 15.5228 9.443e-07 10C0.00606302 4.47966 4.47967 0.0060603 10 -8.09356e-07ZM10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2.00496 14.4162 5.58378 17.995 10 18ZM10 5L15 10L13.59 11.41L11 8.83L11 15L9 15L9 8.83L6.41 11.41L5 10L10 5Z"
            fill={color}
        />
    </svg>
)
