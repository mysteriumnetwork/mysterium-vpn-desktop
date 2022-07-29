/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"
import React, { PropsWithChildren } from "react"

import { Paragraph } from "../../../../ui-kit/typography"

const Container = styled(Paragraph)`
    margin-bottom: 5px;
    text-align: left;
    font-size: 13px;
`

export const OptionLabel: React.FC<PropsWithChildren> = ({ children }) => <Container>{children}</Container>
