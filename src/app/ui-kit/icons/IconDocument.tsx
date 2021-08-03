/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconDocument: React.FC<IconProps> = ({ color }) => (
    <svg height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16 2V16H2V2H16ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0Z"
            fill={color}
        />
        <path d="M11 14H4V12H11V14ZM14 10H4V8H14V10ZM14 6H4V4H14V6Z" fill={color} />
    </svg>
)
