/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { SizeProp } from "@fortawesome/fontawesome-svg-core"

import { LightButton } from "../Button/LightButton"

interface Props {
    size?: SizeProp
    text?: string
}

export const Clipboard: React.FC<Props> = ({ text, size }: Props) => {
    const copy = () => {
        if (text) {
            navigator.clipboard.writeText(text)
        }
    }
    return (
        <LightButton onClick={copy}>
            <FontAwesomeIcon icon={faCopy} size={size} />
        </LightButton>
    )
}
