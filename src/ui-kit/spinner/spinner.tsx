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
import spinnerFile from "./Bars-1s-50px.gif"

const Img = styled.img`
    width: 50;
    height: 50;
`

export const Spinner: React.FC = () => {
    return <Img src={spinnerFile} />
}
