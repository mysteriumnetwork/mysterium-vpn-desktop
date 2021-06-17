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
    margin-bottom: 8px;
    width: 100%;

    padding: 12px;
    border: 1px solid #ffffff4c;
    border-radius: 5px;

    background: #ffffff18;
    color: #fff;
    font-size: 13px;

    &:disabled {
    }
` as React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>
0x3701858fc8375a599c560d1c646900068ced3c76
