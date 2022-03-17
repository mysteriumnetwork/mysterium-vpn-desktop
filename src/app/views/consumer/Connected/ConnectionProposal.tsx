/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../../store"
import { displayTokens4 } from "../../../payment/display"

const MetadataRow = styled.div`
    display: flex;
    justify-content: space-between;
`

const Metadata = styled.div`
    margin-bottom: 20px;
    user-select: text;
`

export const ConnectionProposal: React.FC = observer(function ConnectionProposal() {
    const {
        connection: { proposal },
    } = useStores()
    return (
        <>
            <MetadataRow>
                <Metadata>Node</Metadata>
                <Metadata>{proposal?.shortId}</Metadata>
            </MetadataRow>
            <MetadataRow>
                <Metadata>Price</Metadata>
                <Metadata>{displayTokens4(proposal?.price.perHourTokens)}/h</Metadata>
                <Metadata>{displayTokens4(proposal?.price.perGibTokens)}/GiB</Metadata>
            </MetadataRow>
            <MetadataRow>
                <Metadata>Type</Metadata>
                <Metadata>{proposal?.ipType}</Metadata>
            </MetadataRow>
        </>
    )
})
