/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { darkBlue } from "../../colors"

import { BrandButton } from "./BrandButton"

export const SecondaryButton = styled(BrandButton).attrs({
    background: darkBlue,
})`
    box-shadow: none;
`
