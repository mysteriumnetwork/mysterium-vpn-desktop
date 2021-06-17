/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"
import styled from "styled-components"

import { LogoTitle } from "../../../ui-kit/components/LogoTitle/LogoTitle"

const Container = styled.div`
    box-sizing: border-box;
    height: 58px;
    padding: 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const ViewNavBar: React.FC = ({ children }) => (
    <Container>
        <LogoTitle />
        {children}
    </Container>
)
