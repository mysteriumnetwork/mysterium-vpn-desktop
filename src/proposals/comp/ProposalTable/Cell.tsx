/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

export const Cell = styled.span`
    display: inline-block;
    width: 110px;
    height: 16px;

    &:nth-child(n + 2) {
        width: 80px;
    }
    &:nth-child(n + 3) {
        width: 80px;
        text-align: center;
    }
`
