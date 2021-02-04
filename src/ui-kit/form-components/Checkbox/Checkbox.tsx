/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"
import React from "react"
import { uniqueId } from "lodash"

const Container = styled.div`
    height: 24px;
    font-size: 14px;
    display: flex;
    -webkit-app-region: no-drag;
`

const Input = styled.input`
    margin-right: 8px;
    border-radius: 2px;
    height: 18px;
` as React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>

const Label = styled.label`
    display: inline;
    line-height: 24px;
`

export type CheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    children: React.ReactNode
}

export const Checkbox: React.FC<CheckboxProps> = ({ children, ...rest }) => {
    const inputId = uniqueId("checkbox")
    return (
        <Container>
            <Input id={inputId} type="checkbox" {...rest} />
            <Label htmlFor={inputId}>{children}</Label>
        </Container>
    )
}
