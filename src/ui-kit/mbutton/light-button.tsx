/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

export const LightButton = styled.button`
    padding: 10px 24px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    border-radius: 4px;
    border-color: transparent;
    ${(props): string => {
        if (props.disabled) {
            return "background: #ccc; color: #fff;"
        }
        return "background: #fefefe; color: #333;"
    }}
`
