/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconWallet: React.FC<IconProps> = ({ color }) => (
    <svg height="20" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18 16H2C0.89543 16 0 15.1046 0 14V2C0 0.89543 0.89543 0 2 0H18C19.1046 0 20 0.89543 20 2V14C20 15.1046 19.1046 16 18 16ZM2 8V14H18V8H2ZM2 2V4H18V2H2ZM11 12H4V10H11V12Z"
            fill={color}
        />
    </svg>
)
