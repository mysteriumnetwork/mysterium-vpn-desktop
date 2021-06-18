/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

export const TextInput = styled.input`
    box-sizing: border-box;
    height: 35px;
    margin-bottom: 15px;
    width: 100%;

    padding: 12px;
    border: 1px solid #ffffff4c;
    border-radius: 5px;

    background: #ffffff18;
    color: #fff;
    ::placeholder {
        color: #fff;
    }
    font-family: inherit;
    font-size: 12px;
    line-height: 14px;
` as React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>
