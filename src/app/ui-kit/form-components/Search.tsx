/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { ChangeEvent } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

export interface SearchProps {
    onChange: (text?: string) => void
}

const Icon = styled(FontAwesomeIcon)`
    position: relative;
    z-index: 1;
    left: 24px;
    top: -24px;
    color: #fff;
    opacity: 0.2;
`

const SearchInput = styled.input`
    background: #703a74;
    height: 35px;
    width: 100%;
    padding: 10px 45px;
    box-sizing: border-box;
    border: 0;

    border-radius: 10px;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.2);

    color: #fff;
    ::placeholder {
        color: #fff;
    }
`

export const Search: React.FC<SearchProps> = ({ onChange, ...rest }) => {
    const handleChange = (evt: ChangeEvent<HTMLInputElement>): void => onChange(evt.target.value)
    return (
        <>
            <SearchInput placeholder="Search for node..." onChange={handleChange} {...rest} />
            <Icon icon={faSearch} />
        </>
    )
}
