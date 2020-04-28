/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"

import { TextInput } from "./TextInput"

export interface SearchProps {
    onChange: (text?: string) => void
}

export const Search: React.FC<SearchProps> = ({ onChange, ...rest }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (evt: any): void => onChange(evt.target.value)
    return <TextInput placeholder="Search..." onChange={handleChange} {...rest} />
}
