/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { QualityLevel } from "mysterium-vpn-js"

import { useStores } from "../../../store"
import { Toggle } from "../../../ui-kit/toggle/toggle"
import { PerGiBRate, PerMinuteRate } from "../../../payment/price"
import { Quality } from "../quality/quality"
import { UIProposal } from "../../ui-proposal-type"

const Table = styled.div`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
`

const Header = styled.div`
    flex: 0;
    min-height: 32px;
    padding: 0 16px;
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.2);
`

const ScrollArea = styled.div`
    overflow-y: auto;
`

const Cell = styled.span`
    display: inline-block;
    width: 110px;
    height: 16px;

    &:nth-child(n + 2) {
        width: 80px;
    }
    &:nth-child(n + 3) {
        width: 80px;
        text-align: center;
    }
`

interface ProposalProps {
    proposal: UIProposal
}

const Proposal: React.FC<ProposalProps> = observer(({ proposal }) => {
    const { proposals } = useStores()
    const onToggle = (): void => proposals.toggleActiveProposal(proposal)
    return (
        <Toggle key={proposal.key} active={proposals.active?.key == proposal.key} onClick={onToggle}>
            <Cell>{proposal.id10}</Cell>
            <Cell>
                <PerMinuteRate paymentMethod={proposal.paymentMethod} units={false} />/
                <PerGiBRate paymentMethod={proposal.paymentMethod} units={false} />
            </Cell>
            <Cell>
                <Quality level={proposal.qualityLevel ?? QualityLevel.UNKNOWN} />
            </Cell>
            <Cell>{proposal.serviceType4}</Cell>
        </Toggle>
    )
})

export const ProposalTable: React.FC = observer(() => {
    const { proposals } = useStores()
    const items = proposals.filteredProposals
    console.log("render ProposalTable")
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
