/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { isUnknownCountry } from "../../countries"

export interface FlagProps {
    countryCode?: string
    className?: string
}

const size = 24

export const Flag: React.FC<FlagProps> = ({ className, countryCode = "unknown" }) => {
    const imageName = isUnknownCountry(countryCode) ? "_unknown" : countryCode
    // Flags sourced from https://github.com/wiredmax/react-flags (MIT)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const x1 = require(`./flags-iso/shiny/${size}/${imageName}.png`).default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const x2 = require(`./flags-iso/shiny/${size * 2}/${imageName}.png`).default

    return <img className={className} srcSet={`${x1} 1x, ${x2} 2x`} src={x1} alt={countryCode} width={size} />
}
