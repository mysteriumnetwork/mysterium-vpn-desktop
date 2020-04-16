/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"

import { textHuge, textSmall } from "../../../ui-kit/typography"

export type MetricProps = {
    name: string
    value?: string
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 120px;
`

const Name = styled.span`
    ${textSmall}
    color: #c0b3c9;
`

const Value = styled.span`
    ${textHuge}
    color: #fff;
`

export const Metric: React.FC<MetricProps> = ({ name, value = "" }) => {
    return (
        <Container>
            <Name>{name}</Name>
            <Value>{value}</Value>
        </Container>
    )
}
