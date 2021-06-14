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

import { brand } from "../../colors"

import { ButtonProps } from "./ButtonProps"

const Button = styled.button`
    height: 25px;
    min-height: 25px;
    padding: 0 24px;
    border: none;
    font-size: 12px;
    line-height: 26px;
    border-radius: 100px;
    outline: none;
    box-shadow: 0px 10px 40px rgba(214, 31, 133, 0.4), inset 0px 0px 10px rgba(255, 98, 185, 0.5);

    background: ${(props: ButtonProps): string => (!props.disabled ? brand : "#ccc")};
    color: #fff;

    transition: transform 0.2s;

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
