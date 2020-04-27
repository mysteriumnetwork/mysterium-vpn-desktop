/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { BrandButton } from "./brand-button"

export const CancelButton = styled(BrandButton)`
    ${(props): string => {
        if (props.disabled) {
            return "background: #ccc; color: #fff;"
        }
        return "background: #fefefe; color: #d93c3c;"
    }}
`
