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
import { perGiB, perHour } from "../../../payment/rate"

const MetadataRow = styled.div`
    display: flex;
    justify-content: space-between;
`

const Metadata = styled.div`
    margin-bottom: 20px;
    user-select: text;
`

export const ConnectionProposal: React.FC = observer(() => {
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
                <Metadata>{perHour(proposal?.price)}/h</Metadata>
                <Metadata>{perGiB(proposal?.price)}/GiB</Metadata>
            </MetadataRow>
            <MetadataRow>
                <Metadata>Type</Metadata>
                <Metadata>{proposal?.ipType}</Metadata>
            </MetadataRow>
        </>
    )
})
