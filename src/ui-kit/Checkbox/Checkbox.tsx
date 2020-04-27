/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"
import React from "react"

const Label = styled.label`
    font-size: 14px;
    color: #333;
    user-select: none;

    > input {
        margin-right: 8px;
        border-radius: 2px;
    }
`

export type CheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    children: React.ReactNode
}

export const Checkbox: React.FC<CheckboxProps> = ({ children, ...rest }) => {
    return (
        <Label>
            <input type="checkbox" {...rest} />
            {children}
        </Label>
    )
}
