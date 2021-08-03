/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconMusic: React.FC<IconProps> = ({ color }) => (
    <svg height="16" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M19 0H14V8.18C13.69 8.07 13.35 8 13 8C11.34 8 10 9.34 10 11C10 12.66 11.34 14 13 14C14.66 14 16 12.66 16 11V2H19V0ZM12 0H0V2H12V0ZM12 4H0V6H12V4ZM8 8H0V10H8V8ZM12 11C12 10.45 12.45 10 13 10C13.55 10 14 10.45 14 11C14 11.55 13.55 12 13 12C12.45 12 12 11.55 12 11Z"
            fill={color}
        />
    </svg>
)
