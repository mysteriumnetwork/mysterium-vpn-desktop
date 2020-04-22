/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"

import { Cell } from "./Cell"
import { Header } from "./Header"
import { Proposal } from "./Proposal"

const Table = styled.div`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
`

const ScrollArea = styled.div`
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`

export const ProposalTable: React.FC = observer(() => {
    const { proposals } = useStores()
    const items = proposals.filteredProposals
    return (
        <Table>
            <Header>
                <Cell>ID</Cell>
                <Cell>Price</Cell>
                <Cell>Quality</Cell>
                <Cell>Service</Cell>
            </Header>
            <ScrollArea>
                {items.map((p) => (
                    <Proposal key={p.key} proposal={p} />
                ))}
            </ScrollArea>
        </Table>
    )
})
