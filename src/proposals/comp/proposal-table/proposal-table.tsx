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
import { Toggle } from "../../../ui-kit/toggle/toggle"
import { PerGiBRate, PerMinuteRate } from "../../../payment/price"

const Table = styled.div``
const Header = styled.div`
    height: 32px;
    padding: 0 16px;
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.2);
`

const Cell = styled.span`
    display: inline-block;
    width: 100px;
`
export const ProposalTable: React.FC = observer(() => {
    const { proposals } = useStores()
    const items = proposals.filteredProposals
    return (
        <Table>
            <Header>
                <Cell>ID</Cell>
                <Cell>Price/min</Cell>
                <Cell>Price/GiB</Cell>
                <Cell>Service type</Cell>
            </Header>
            {items.map((p) => {
                const onToggle = (): void => proposals.toggleActiveProposal(p)
                return (
                    <Toggle key={p.key} active={proposals.active?.key == p.key} onClick={onToggle}>
                        <Cell>{p.id10}</Cell>
                        <Cell>
                            <PerMinuteRate paymentMethod={p.paymentMethod} units={false} />
                        </Cell>
                        <Cell>
                            <PerGiBRate paymentMethod={p.paymentMethod} units={false} />
                        </Cell>
                        <Cell>{p.serviceType4}</Cell>
                    </Toggle>
                )
            })}
        </Table>
    )
})
