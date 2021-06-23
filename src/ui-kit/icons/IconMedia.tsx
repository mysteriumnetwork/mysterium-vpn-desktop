/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { IconProps } from "./Props"

export const IconMedia: React.FC<IconProps> = ({ color }) => (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15ZM6.49479 5.04893L9.83522 7.18385C9.93725 7.24914 10.0002 7.36969 10 7.50009C10 7.63049 9.93717 7.75109 9.8351 7.81624L6.49467 9.95111C6.44367 9.98378 6.38668 10 6.3298 10C6.27285 10 6.21598 9.98378 6.16482 9.95111C6.063 9.886 6 9.76545 6 9.63496V5.36522C6 5.23477 6.06287 5.11413 6.16482 5.04893C6.26706 4.98369 6.39268 4.98369 6.49479 5.04893Z"
            fill={color}
        />
    </svg>
)
