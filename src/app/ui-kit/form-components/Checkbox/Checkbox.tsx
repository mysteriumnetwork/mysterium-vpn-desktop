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
    font-size: 13px;
    display: flex;
    -webkit-app-region: no-drag;
`

const Input = styled.input`
    margin-right: 8px;
    border-radius: 2px;
    height: 18px;
    width: 18px;
    -webkit-appearance: none;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z" stroke="%23ed5bac" fill="%23ed5bac"/></svg>');
    &:checked {
        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-5.541 8.409l-1.422-1.409-7.021 7.183-3.08-2.937-1.395 1.435 4.5 4.319 8.418-8.591z" stroke="%23ed5bac" fill="%23ed5bac"/></svg>');
    }
` as React.FC<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>

const Label = styled.label`
    display: inline;
    line-height: 24px;
`

export type CheckboxProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    children?: React.ReactNode
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
