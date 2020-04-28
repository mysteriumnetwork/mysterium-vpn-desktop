/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

export interface ToggleProps {
    small?: boolean
    children: React.ReactNode
    active: boolean
    onClick: Function
}

export const NavToggle = styled.div<ToggleProps>`
    box-sizing: border-box;
    width: 152px;
    height: 24px;
    padding: 2px 16px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    user-select: none;

    color: ${(props: ToggleProps): string => (props.active ? "#fff" : "#404040")};
    background: ${(props: ToggleProps): string =>
        props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "#fff"};
    &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
` as React.FC<ToggleProps>
