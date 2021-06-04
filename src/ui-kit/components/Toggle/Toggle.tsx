/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

import { brandNew } from "../../colors"

import { NavToggle, ToggleProps } from "./NavToggle"

export const Toggle = styled(NavToggle)`
    height: 25px;
    min-height: 25px;
    line-height: 25px;
    width: calc(100%);
    border-radius: 5px;
    justify-content: flex-start;
    background: ${(props: ToggleProps): string => (props.active ? brandNew : "transparent")};
    &:hover {
        background: ${(props: ToggleProps): string => (props.active ? brandNew : `${brandNew}1A`)};
    }
    box-shadow: ${(props: ToggleProps): string => (props.active ? "0px 5px 10px rgba(214, 31, 133, 0.2)" : "none")};
` as React.FC<ToggleProps>
