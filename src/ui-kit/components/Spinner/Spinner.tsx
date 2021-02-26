/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

// Loading.io Free License
// With Loading.io Free license ( LD-FREE / FREE / Free License ),
// items are dedicated to the public domain by waiving all our right worldwide under copyright law.
// You can use items under LD-FREE freely for any purpose. No attribution is required.
import spinnerFile from "./Dual Ring-1s-100px.svg"
import spinnerDarkFile from "./Dual Ring-1s-100px-dark.svg"

const Img = styled.img`
    width: 75px;
    height: 75px;
`

export interface SpinnerProps {
    dark?: boolean
}

export const Spinner: React.FC<SpinnerProps> = ({ dark = false }) => {
    return <Img src={dark ? spinnerDarkFile : spinnerFile} />
}
