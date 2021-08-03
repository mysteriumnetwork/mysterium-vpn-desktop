/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"

import { IconProps } from "../Props"

export const IconCurrencyLTC: React.FC<IconProps> = ({ color }) => (
    <svg width="264" height="264" viewBox="0 0 264 264" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="132" cy="132" r="128" stroke={color} strokeWidth="8" />
        <path d="M94.4578 194H183.659V167.968L126.231 168.127L149.994 58H124.256L94.4578 194Z" fill={color} />
        <path d="M81 119.495L164.333 98.9553V116.048L81 136.588V119.495Z" fill={color} />
    </svg>
)
