/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { darkBlue, lightBlue } from "../../colors"

import { BrandButton } from "./BrandButton"

export const OutlineButton = styled(BrandButton).attrs({
    background: "transparent",
    color: darkBlue,
})`
    box-shadow: none;
    border: 2px solid ${lightBlue};
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`
