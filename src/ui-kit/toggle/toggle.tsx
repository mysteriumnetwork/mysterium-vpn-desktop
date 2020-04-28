/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

import { NavToggle, ToggleProps } from "./nav-toggle"

export const Toggle = styled(NavToggle)`
    height: 32px;
    min-height: 32px;
    width: calc(100%);
    border-radius: 4px;
    justify-content: flex-start;
    background: ${(props: ToggleProps): string =>
        props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "transparent"};
    &:hover {
        background: ${(props: ToggleProps): string =>
            props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "#e6e6e6"};
    }
` as React.FC<ToggleProps>
