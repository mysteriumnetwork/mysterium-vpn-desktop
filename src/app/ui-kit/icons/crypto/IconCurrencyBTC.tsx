/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"

import { IconProps } from "../Props"

export const IconCurrencyBTC: React.FC<IconProps> = ({ color }) => (
    <svg width="264" height="264" viewBox="0 0 264 264" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M190.204 100.934C190.204 82.5536 178.276 66.9786 161.783 61.5163V44.0958H139.694V59.3756H126.22V44.0958H104.131V59.3756H85.6499V120.347V142.492V203.463H104.131V218.743H126.22V203.463H139.694V218.743H161.783V201.323C178.276 195.86 190.204 180.211 190.204 161.905C190.204 149.873 185.05 139.022 176.877 131.419C185.05 123.816 190.204 112.966 190.204 100.934ZM148.751 181.319H107.739V142.492H148.751C159.427 142.492 168.115 151.202 168.115 161.905C168.115 172.608 159.427 181.319 148.751 181.319ZM148.751 120.347H107.739V81.5202H148.751C159.427 81.5202 168.115 90.2304 168.115 100.934C168.115 111.637 159.427 120.347 148.751 120.347Z"
            stroke={color}
            strokeWidth="8"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="132" cy="132" r="128" stroke={color} strokeWidth="8" />
    </svg>
)
