/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

import { CommonButtonProps } from "./props"

const Button = styled.button`
    padding: 10px 24px;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #fff;
    border-radius: 4px;
    background: ${(props): string =>
        !props.disabled ? "linear-gradient(180deg, rgba(124,36,99,1) 0%, rgba(85,36,98,1) 100%)" : "#ccc"};
    box-shadow: ${(props): string =>
        !props.disabled? "inset 0 0.5px 1px #ff25a1;" : "inherit"};
`

export const BrandButton: React.FC<CommonButtonProps> = ({ disabled = false, text = "", onClick }) => {
    return (
        <Button disabled={disabled} onClick={onClick}>
            {text}
        </Button>
    )
}
