/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export interface MystTokenProps {
    color?: string
}

export const IconMystToken: React.FC<IconProps> = ({ color }) => {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 6C0 6.31619 0.0244585 6.62667 0.0715869 6.92965L3.95901 3.04223L5.99939 5.0826L8.03994 3.04205L8.04095 3.04307L8.04234 3.04168L10.0837 5.08299L10.0823 5.08438L11.9283 6.93041C11.9755 6.62719 12 6.31646 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6ZM5.99956 5.0843L5.99964 5.08438L5.9813 5.10272L5.98122 5.10264L5.99956 5.0843ZM3.97686 7.107L1.32394 9.75992C2.42372 11.1259 4.10978 12 6 12C7.88999 12 9.57588 11.1261 10.6757 9.76041L8.04095 7.12569L6.00103 9.16561L3.95972 7.1243L3.97694 7.10708L3.97686 7.107Z"
                fill={color}
            />
        </svg>
    )
}
