import { UIProposal } from "../../ui-proposal-type"
import React from "react"
import { Toggle } from "../../../ui-kit/toggle/toggle"
import { Text, View } from "@nodegui/react-nodegui"
import { timeRate, trafficRate } from "../../../payment/rate"
import { observer } from "mobx-react-lite"
import { useStores } from "../../../store"
import { proposalsCellStyle } from "./style"

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
            <Toggle width={532} height={35} active={active} onToggle={onToggle}>
                <View
                    style={`
                    width: "100%";
                    padding: 10;
                    `}
                >
                    <View style={proposalsCellStyle}>
                        <Text
                            style={`
                            font-family: "Monaco, monospace";
                            font-size: 12px;
                            color: ${active ? "white" : "inherit"}
                            `}
                        >
                            {proposal.id10}
                        </Text>
                    </View>
                    <View style={`width: 100;`}>
                        <Text style={`color: ${active ? "white" : "inherit"}`}>{timeRate(proposal)}</Text>
                    </View>
                    <View style={proposalsCellStyle}>
                        <Text style={`color: ${active ? "white" : "inherit"}`}>{trafficRate(proposal)}</Text>
                    </View>
                    <View style={proposalsCellStyle}>
                        <Text style={`color: ${active ? "white" : "inherit"}`}>{proposal.serviceType4}</Text>
                    </View>
                </View>
            </Toggle>
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
