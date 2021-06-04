/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { CircleFlag } from "react-circle-flags"

export interface FlagProps {
    className?: string
    countryCode?: string
}

const size = 15

export const Flag: React.FC<FlagProps> = ({ className, countryCode = "unknown" }) => {
    return <CircleFlag className={className} countryCode={countryCode?.toLowerCase() ?? "unknown"} height={size} />
}
