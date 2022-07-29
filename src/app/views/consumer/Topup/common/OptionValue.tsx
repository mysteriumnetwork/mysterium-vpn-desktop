/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"
import React, { PropsWithChildren } from "react"

const Container = styled.div`
    margin-bottom: 15px;
`
export const OptionValue: React.FC<PropsWithChildren> = ({ children }) => <Container>{children}</Container>
