/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconBrowsing: React.FC<IconProps> = ({ color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 -2.52844e-08 7.5 0C3.35786 1.40915e-07 -2.52844e-08 3.35786 0 7.5C2.52844e-08 11.6421 3.35786 15 7.5 15ZM4.51875 3.46055L11.3683 7.56246C11.4666 7.63707 11.4975 7.70755 11.5098 7.7565C11.5518 7.92394 11.45 8.0939 11.2825 8.13588L9.25141 8.64509L11.1514 11.1447C11.2212 11.2364 11.2032 11.3673 11.1115 11.4367L9.94913 12.3213C9.92638 12.3386 9.9007 12.3511 9.8736 12.3579C9.84813 12.3643 9.82143 12.3658 9.79482 12.3626C9.73998 12.3548 9.69061 12.3259 9.65722 12.2819L7.69472 9.70078L6.50878 11.4033C6.47641 11.4579 6.40842 11.5072 6.32955 11.527C6.16211 11.5689 5.99215 11.4671 5.95017 11.2997L4.07434 3.81746C4.01461 3.57922 4.2782 3.35155 4.51875 3.46055Z"
            fill={color}
        />
    </svg>
)
