/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { isUnknownCountry } from "../../countries"
import { log } from "../../../log/log"

export interface FlagProps {
    countryCode?: string
    className?: string
}

const size = 24
const unknownCountry = "_unknown"

const resolveFlagUrls = (imageName: string): { x1: string; x2: string } => {
    // Flags sourced from https://github.com/wiredmax/react-flags (MIT)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const x1 = require(`./flags-iso/shiny/${size}/${imageName}.png`).default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const x2 = require(`./flags-iso/shiny/${size * 2}/${imageName}.png`).default

    return { x1, x2 }
}

export const Flag: React.FC<FlagProps> = ({ className, countryCode = "unknown" }) => {
    const imageName = isUnknownCountry(countryCode) ? unknownCountry : countryCode
    try {
        const flags = resolveFlagUrls(imageName)
        return (
            <img
                className={className}
                srcSet={`${flags.x1} 1x, ${flags.x2} 2x`}
                src={flags.x1}
                alt={countryCode}
                width={size}
            />
        )
    } catch (e) {
        log.error(`could not resolve flag icon for countryCode: ${countryCode}`, e)
        const flags = resolveFlagUrls(unknownCountry)
        return (
            <img
                className={className}
                srcSet={`${flags.x1} 1x, ${flags.x2} 2x`}
                src={flags.x1}
                alt={countryCode}
                width={size}
            />
        )
    }
}
