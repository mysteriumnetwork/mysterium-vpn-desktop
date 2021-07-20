/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { faDollarSign } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"

const Container = styled.div`
    width: 33px;
    font-size: 12px;
    overflow: hidden;
`

const Dollar = styled(FontAwesomeIcon)`
    &:not(:last-child) {
        padding-right: 6px;
    }
`
export interface IconPriceTierProps {
    tier: number
}

export const IconPriceTier: React.FC<IconPriceTierProps> = (props) => {
    return (
        <Container>
            <Dollar icon={faDollarSign} opacity={props.tier > 0 ? 1 : 0.2} />
            <Dollar icon={faDollarSign} opacity={props.tier > 1 ? 1 : 0.2} />
            <Dollar icon={faDollarSign} opacity={props.tier > 2 ? 1 : 0.2} />
        </Container>
    )
}
