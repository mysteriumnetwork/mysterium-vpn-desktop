/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { BrandButton } from "./BrandButton"

export const LightButton = styled(BrandButton).attrs({
    background: "#ffffff44",
    color: "#fff",
})`
    box-shadow: none;
    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`
