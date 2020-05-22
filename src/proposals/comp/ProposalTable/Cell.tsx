/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

export const Cell = styled.div`
    flex: 1;

    height: 16px;

    &:nth-child(1) {
        min-width: 180px;
    }
    &:nth-child(n + 3) {
        text-align: center;
    }
`
