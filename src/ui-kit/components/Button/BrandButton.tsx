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

export type BrandButtonProps = {
    background?: string
    disabledBackground?: string
    color?: string
    loading?: boolean
    className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const defaultProps = {
    background: brand,
    color: "#fff",
    disabledBackground: "#ccc",
}

const Button = styled.button<BrandButtonProps & typeof defaultProps>`
    height: 35px;
    min-height: 35px;
    padding: 0 24px;
    border: none;
    font-size: 14px;
    line-height: 26px;
    font-weight: 500;
    border-radius: 100px;
    outline: none;
    box-shadow: ${(props) => {
        if (!props.disabled) {
            return "0px 10px 40px rgba(214, 31, 133, 0.4), inset 0px 0px 10px rgba(255, 98, 185, 0.5)"
        }
        return "none"
    }};

    background: ${(props) => (!props.disabled ? props.background : props.disabledBackground)};
    color: ${(props) => props.color};

    transition: transform 0.2s;

    &:enabled:hover {
        filter: brightness(115%);
    }
    &:active {
        transform: scale(0.95);
    }

    -webkit-app-region: no-drag;
    user-select: none;
`

const Icon = styled(FontAwesomeIcon)`
    margin-left: 8px;
    animation: fa-spin 0.7s infinite linear;
`

export const BrandButton: React.FC<BrandButtonProps> = ({
    background = defaultProps.background,
    disabledBackground = defaultProps.disabledBackground,
    color = defaultProps.color,
    loading = false,
    children,
    className = "",
    ...rest
}) => {
    const indicator = loading ? <Icon icon={faCircleNotch} color={color} spin /> : null
    return (
        <Button
            background={background}
            color={color}
            disabledBackground={disabledBackground}
            className={className}
            {...rest}
        >
            {children}
            {indicator}
        </Button>
    )
}
