/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

export const TextInput = styled.input`
    box-sizing: border-box;
    height: 32px;
    margin-bottom: 8px;
    width: 100%;

    padding: 2px;
    border: 2px solid #c4c4c4;
    border-radius: 4px;

    background: #fff;
    color: #4d4d4d;
    font-size: 13px;

    &:disabled {
        background: #f2f2f2;
        color: #808080;
    }
` as React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>
