/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

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

const ScrollAreaContainer = styled.div`
    flex: 1;
`

const ProposalContainer = styled.div`
    padding: 0 8px;
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
            <ScrollAreaContainer>
                <AutoSizer>
                    {({ width, height }): JSX.Element => (
                        <FixedSizeList itemCount={items.length} itemSize={32} width={width} height={height}>
                            {({ index, style }): JSX.Element => {
                                const proposal = items[index]
                                return (
                                    <div style={style}>
                                        <ProposalContainer>
                                            <Proposal key={proposal.key} proposal={proposal} />
                                        </ProposalContainer>
                                    </div>
                                )
                            }}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            </ScrollAreaContainer>
        </Table>
    )
})
