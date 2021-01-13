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
    onClick: () => void
}

export const NavToggle = styled.div<ToggleProps>`
    box-sizing: border-box;
    height: 30px;
    line-height: 24px;
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    align-items: center;

    color: ${(props: ToggleProps): string => (props.active ? "#fff" : "#404040")};
    background: ${(props: ToggleProps): string =>
        props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "none"};
    &:hover {
        background: #eee8e8;
    }
    border-radius: 4px;
    overflow: hidden;
` as React.FC<ToggleProps>
