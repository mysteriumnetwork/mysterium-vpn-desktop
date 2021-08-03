/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"

import { IconProps } from "../Props"

export const IconCurrencyETH: React.FC<IconProps> = ({ color }) => (
    <svg width="264" height="264" viewBox="0 0 264 264" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="132" cy="132" r="128" stroke={color} strokeWidth="8" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M131.737 43L187.475 144.639L131.737 220.048L76 144.639L131.737 43ZM174.273 137.203L135.738 122.091V66.932L174.273 137.203ZM170.741 153.82L131.738 169.115L92.734 153.82L131.737 206.589L170.741 153.82ZM127.738 66.9318V122.091L89.2017 137.203L127.738 66.9318ZM135.738 158.954L171.781 144.819L135.738 130.684V158.954ZM127.738 158.954L91.6939 144.819L127.738 130.684V158.954Z"
            fill={color}
        />
    </svg>
)
