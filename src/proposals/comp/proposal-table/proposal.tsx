/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { UIProposal } from "../../ui-proposal-type"
import React from "react"
import { Toggle } from "../../../ui-kit/toggle/toggle"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../store"
import { proposalsCellStyle } from "./style"
import { textSmall } from "../../../ui-kit/typography"
import { PerGiBRate, PerMinuteRate } from "../../../payment/price"

export type ProposalFCProps = {
    proposal: UIProposal
    activeKey?: string
    onToggle: () => void
}

// eslint-disable-next-line react/display-name
const ProposalPure: React.FC<ProposalFCProps> = React.memo(
    ({ proposal, activeKey, onToggle }) => {
        const active = activeKey === proposal.key
        return (
            <View style={`padding: 2;`}>
                <Toggle width={532} height={36} active={active} onToggle={onToggle}>
                    <View
                        style={`
                        width: "100%";
                        padding: 10;
                        `}
                    >
                        <View style={proposalsCellStyle}>
                            <Text
                                style={`
                                ${textSmall}
                                font-family: "Monaco, monospace";
                                color: ${active ? "white" : "inherit"}
                                `}
                            >
                                {proposal.id10}
                            </Text>
                        </View>
                        <View
                            id="cell"
                            styleSheet={`
                            #cell, #cell-active {
                                width: 100;
                            }
                            #cell QLabel {
                                color: ${active ? "white" : "inherit"};
                            }
                            `}
                        >
                            <PerMinuteRate paymentMethod={proposal.paymentMethod} units={false} />
                        </View>
                        <View
                            id="cell"
                            styleSheet={`
                            #cell {
                                width: 100;
                            }
                            #cell QLabel {
                                color: ${active ? "white" : "inherit"};
                            }
                            `}
                        >
                            <PerGiBRate paymentMethod={proposal.paymentMethod} units={false} />
                        </View>
                        <View style={proposalsCellStyle}>
                            <Text style={`color: ${active ? "white" : "inherit"}`}>{proposal.serviceType4}</Text>
                        </View>
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
