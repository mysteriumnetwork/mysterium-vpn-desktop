/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"

import { UIProposal } from "../../ui-proposal-type"
import { useStores } from "../../../store"
import { Toggle } from "../../../ui-kit/toggle/toggle"
import { PerGiBRate, PerMinuteRate } from "../../../payment/price"

export type ProposalFCProps = {
    proposal: UIProposal
    activeKey?: string
    onToggle: () => void
}

// eslint-disable-next-line react/display-name
const ProposalPure: React.FC<ProposalFCProps> = React.memo(
    ({ proposal: { key, paymentMethod, serviceType4, id10 }, activeKey, onToggle }) => {
        const active = activeKey === key
        const cellId = !active ? "ProposalTable-Proposal-cell" : "ProposalTable-Proposal-cell-active"
        return (
            <View id="ProposalTable-Proposal-row-outer">
                <Toggle
                    id={active ? "ProposalTable-Proposal-Toggle-active" : "ProposalTable-Proposal-Toggle-inactive"}
                    onToggle={onToggle}
                >
                    <View id="ProposalTable-Proposal-row" size={{ width: 385, height: 37 }}>
                        <Text id={cellId}>{id10}</Text>
                        <PerMinuteRate id={cellId} paymentMethod={paymentMethod} units={false} />
                        <PerGiBRate id={cellId} paymentMethod={paymentMethod} units={false} />
                        <Text id={cellId}>{serviceType4}</Text>
                    </View>
                </Toggle>
            </View>
        )
    },
    (prevProps, nextProps) => {
        return (
            // If same key and it was not active/will not be active - leave it alone and do not re-render
            prevProps.proposal.key === nextProps.proposal.key &&
            ![prevProps.activeKey, nextProps.activeKey].includes(nextProps.proposal.key)
        )
    },
)

export type ProposalProps = {
    proposal: UIProposal
}

export const Proposal: React.FC<ProposalProps> = observer(({ proposal }) => {
    const { proposals } = useStores()
    const onToggle = (): void => proposals.toggleActiveProposal(proposal)
    const activeKey = proposals.active?.key
    return <ProposalPure proposal={proposal} activeKey={activeKey} onToggle={onToggle} />
})
