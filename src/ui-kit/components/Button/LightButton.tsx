/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { BrandButton } from "./BrandButton"

export const LightButton = styled(BrandButton).attrs({
    background: "#fefefe",
    color: "#333",
})`
    box-shadow: none;
    display: inline-flex;
    align-items: center;
`
