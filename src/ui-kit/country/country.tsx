/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { resolveCountry } from "../../location/countries"

import { ResolvedCountry } from "./resolved-country"

export type CountryProps = {
    code?: string
    containerStyle?: string
    textStyle?: string
    flagStyle?: string
    text?: boolean
}

export const Country: React.FC<CountryProps> = ({ code, containerStyle, textStyle, text, flagStyle }) => {
    const c = resolveCountry(code)
    const flagBase64 = Buffer.from(c.flag, "base64")
    return (
        <ResolvedCountry
            name={c.name}
            flagBase64={flagBase64}
            textStyle={textStyle}
            containerStyle={containerStyle}
            flagStyle={flagStyle}
            text={text}
        />
    )
}
