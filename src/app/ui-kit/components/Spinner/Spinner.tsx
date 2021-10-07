/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"

const Icon = styled(FontAwesomeIcon)`
    animation: fa-spin 0.7s infinite linear;
`

export interface SpinnerProps {
    className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ className }) => {
    return (
        <div className={className}>
            <Icon icon={faCircleNotch} spin />
        </div>
    )
}
