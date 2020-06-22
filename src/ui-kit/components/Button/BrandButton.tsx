/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"
import React from "react"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { ButtonProps } from "./ButtonProps"

const Button = styled.button`
    box-sizing: border-box;
    height: 40px;
    min-height: 40px;
    padding: 0 16px;
    border: none;
    font-size: 14px;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: bold;
    letter-spacing: 1px;
    border-radius: 4px;
    outline: none;

    background: ${(props: ButtonProps): string =>
        !props.disabled ? "linear-gradient(180deg, #7c2463 0%, #552462 100%)" : "#ccc"};
    color: #fff;

    transition: 0.2s all;

    &:enabled:hover {
        filter: brightness(115%);
    }
    &:active {
        transform: scale(0.95);
    }
` as React.FC<ButtonProps>

const Icon = styled(FontAwesomeIcon)`
    margin-left: 8px;
    animation: fa-spin 0.7s infinite linear;
`

export const BrandButton: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
    const { loading = false, children, ...rest } = props
    const indicator = loading ? <Icon icon={faCircleNotch} color="#fff" spin /> : null
    return (
        <Button {...rest}>
            {children}
            {indicator}
        </Button>
    )
}
