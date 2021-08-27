/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

export const Select = styled.select`
    box-sizing: border-box;
    height: 35px;
    width: 100%;

    padding: 0 12px;
    border: 1px solid #ffffff4c;
    border-radius: 5px;

    background: #5a2058;
    color: #fff;
    ::placeholder {
        color: #fff;
    }
    font-family: inherit;
    font-size: 12px;
    line-height: 14px;
`
