/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

export interface SearchProps {
    onChange: (text?: string) => void
}

const Wrapper = styled.div`
    background: cyan;
`
const Input = styled.input`
    height: 24px;
    margin: 8px;
    border-radius: 4px;
    border-color: transparent;
    background: #e7e7e7;
    font-size: 13px;
`

export const Search: React.FC<SearchProps> = ({ onChange, ...rest }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (evt: any): void => onChange(evt.target.value)
    return (
        <Wrapper>
            <Input placeholder="Search..." onChange={handleChange} {...rest} />
        </Wrapper>
    )
}
