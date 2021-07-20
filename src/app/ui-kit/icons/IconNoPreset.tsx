/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconNoPreset: React.FC<IconProps> = ({ color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15ZM8.12821 9.6L9.38462 7.1V11H11V4H9.29487L7.5 7.7L5.70513 4H4V11H5.61538V7.1L6.8718 9.6H8.12821Z"
                fill={color}
            />
        </svg>
    </svg>
)
