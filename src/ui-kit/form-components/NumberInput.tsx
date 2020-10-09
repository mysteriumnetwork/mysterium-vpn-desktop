/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useRef } from "react"

import { TextInput } from "./TextInput"

export type NumberInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    length?: number
    onChangeFn?: (val?: number) => void
}

export const NumberInput: React.FC<NumberInputProps> = ({ length, onChangeFn, ...props }) => {
    const ref = useRef<HTMLInputElement>(null)
    const handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
        const num = parseFloat(evt.target.value)
        if (ref.current) {
            ref.current.value = isNaN(num) ? "" : num.toString()
        }
        if (onChangeFn) {
            onChangeFn(isNaN(num) ? undefined : num)
        }
    }
    const handleInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let str = evt.target.value
        str = str.replace(/[^0-9.,]/g, "") // Remove non-digit and non-separators
        if (length && str.length > length) {
            // Truncate if length is exceeded
            str = str.substr(0, length)
        }
        if (ref.current) {
            ref.current.value = str
        }
        const num = parseFloat(str)
        if (onChangeFn) {
            onChangeFn(isNaN(num) ? undefined : num)
        }
    }
    return <TextInput ref={ref} type="text" onBlur={handleBlur} onInput={handleInput} {...props} />
}
