/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { QualityLevel } from "mysterium-vpn-js"

import highQ from "./high.png"
import mediumQ from "./medium.png"
import lowQ from "./low.png"
import unknownQ from "./unknown.png"

const levelToImage = (level: QualityLevel): string => {
    switch (level) {
        case QualityLevel.HIGH:
            return highQ
        case QualityLevel.MEDIUM:
            return mediumQ
        case QualityLevel.LOW:
            return lowQ
        default:
            return unknownQ
    }
}

const QualityImage = styled.img`
    width: 16px;
    height: 16px;
`

export interface QualityProps {
    level: QualityLevel
}

export const Quality: React.FC<QualityProps> = ({ level = QualityLevel.UNKNOWN }) => {
    return <QualityImage src={levelToImage(level)} />
}
