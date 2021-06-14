/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

import { brandNew } from "../../colors"

export interface ToggleProps {
    children: React.ReactNode
    active: boolean
    textColor?: string
    hoverColor?: string
    activeColor?: string
    activeTextColor?: string
    activeShadowColor?: string
    paddingX?: string
    onClick?: () => void
}

const defaultProps = {
    textColor: "#3c3857",
    hoverColor: `${brandNew}1A`,
    activeColor: brandNew,
    activeTextColor: "#fff",
    activeShadowColor: "none",
    paddingX: "12px",
}

const Highlight = styled.div<ToggleProps & typeof defaultProps>`
    padding: 0 ${(props) => props.paddingX};
    height: 25px;
    min-height: 25px;
    line-height: 25px;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    color: ${(props) => (props.active ? props.activeTextColor : props.textColor)};
    background: ${(props) => (props.active ? props.activeColor : "transparent")};
    box-shadow: ${(props) => (props.active ? props.activeShadowColor : "none")};
`

const Container = styled.div<ToggleProps & typeof defaultProps>`
    box-sizing: border-box;
    width: calc(100%);
    height: 30px;
    min-height: 30px;
    padding: 3px 0 0 2px;

    &:hover ${Highlight} {
        background: ${(props): string => (props.active ? props.activeColor : props.hoverColor)};
    }
`

export const Toggle: React.FC<ToggleProps> = ({
    onClick,
    children,
    active,
    textColor = defaultProps.textColor,
    hoverColor = defaultProps.hoverColor,
    activeColor = defaultProps.activeColor,
    activeTextColor = defaultProps.activeTextColor,
    activeShadowColor = defaultProps.activeShadowColor,
    paddingX = defaultProps.paddingX,
}: ToggleProps) => {
    const styles = { textColor, hoverColor, activeColor, activeTextColor, activeShadowColor, paddingX }
    return (
        <Container className={active ? "active" : ""} active={active} onClick={onClick} {...styles}>
            <Highlight active={active} {...styles}>
                {children}
            </Highlight>
        </Container>
    )
}
