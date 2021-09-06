/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { RefObject } from "react"
import styled from "styled-components"

import { brand, darkBlue } from "../../colors"

export interface ToggleProps {
    children: React.ReactNode
    active: boolean
    height?: string
    justify?: string
    textColor?: string
    hoverColor?: string
    activeColor?: string
    inactiveColor?: string
    activeTextColor?: string
    activeShadowColor?: string
    paddingX?: string
    onClick?: () => void
    className?: string
    innerRef?: RefObject<HTMLDivElement>
}

const defaultProps = {
    height: "25px",
    justify: "flex-start",
    textColor: darkBlue,
    hoverColor: `${brand}1A`,
    activeColor: brand,
    inactiveColor: "transparent",
    activeTextColor: "#fff",
    activeShadowColor: "none",
    paddingX: "12px",
}

const Highlight = styled.div<ToggleProps & typeof defaultProps>`
    padding: 0 ${(props) => props.paddingX};
    height: ${(props) => props.height};
    min-height: 25px;
    line-height: 25px;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: ${(props) => props.justify};
    overflow: hidden;

    color: ${(props) => (props.active ? props.activeTextColor : props.textColor)};
    background: ${(props) => (props.active ? props.activeColor : props.inactiveColor)};
    box-shadow: ${(props) => (props.active ? props.activeShadowColor : "none")};
`

const Container = styled.div<ToggleProps & typeof defaultProps>`
    box-sizing: border-box;
    width: calc(100%);
    height: 30px;
    min-height: 30px;
    padding: 3px 0 0 2px;

    &:hover ${Highlight} {
        background: ${(props) => (props.active ? props.activeColor : props.hoverColor)};
    }
`

export const Toggle: React.FC<ToggleProps> = ({
    onClick,
    children,
    active,
    height = defaultProps.height,
    justify = defaultProps.justify,
    textColor = defaultProps.textColor,
    hoverColor = defaultProps.hoverColor,
    activeColor = defaultProps.activeColor,
    inactiveColor = defaultProps.inactiveColor,
    activeTextColor = defaultProps.activeTextColor,
    activeShadowColor = defaultProps.activeShadowColor,
    paddingX = defaultProps.paddingX,
    className,
    innerRef,
}: ToggleProps) => {
    const styles = {
        height,
        justify,
        textColor,
        hoverColor,
        activeColor,
        inactiveColor,
        activeTextColor,
        activeShadowColor,
        paddingX,
    }
    return (
        <Container
            className={`${className} ${active ? "active" : ""}`}
            active={active}
            onClick={onClick}
            {...styles}
            ref={innerRef}
        >
            <Highlight active={active} {...styles}>
                {children}
            </Highlight>
        </Container>
    )
}
