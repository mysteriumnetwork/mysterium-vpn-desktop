import React from "react"
import { useStores } from "../../store"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { UIProposal } from "../ui-proposal-type"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { timeRate, trafficRate } from "../../payment/rate"

export const proposalsCellStyle = `
width: 100;
`

export const ProposalTableHeader: React.FC = () => (
    <View
        style={`
        width: "100%"; 
        padding: 10;
        border-bottom: 1px solid #dcdcdc;
        `}
    >
        <View style={proposalsCellStyle}>
            <Text>ID</Text>
        </View>
        <View style={proposalsCellStyle}>
            <Text>Price/min</Text>
        </View>
        <View style={proposalsCellStyle}>
            <Text>Price/GiB</Text>
        </View>
        <View style={proposalsCellStyle}>
            <Text>Service type</Text>
        </View>
    </View>
)

export type ProposalProps = {
    proposal: UIProposal
}

export type ProposalFCProps = {
    proposal: UIProposal
    activeKey?: string
    onToggle: () => void
}

// eslint-disable-next-line react/display-name
const Proposal: React.FC<ProposalFCProps> = React.memo(
    ({ proposal, activeKey, onToggle }) => {
        return (
            <Toggle width={532} height={35} active={activeKey === proposal.key} onToggle={onToggle}>
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
                        `}
                        >
                            {proposal.id10}
                        </Text>
                    </View>
                    <View style={`width: 100;`}>
                        <Text>{timeRate(proposal)}</Text>
                    </View>
                    <View style={proposalsCellStyle}>
                        <Text>{trafficRate(proposal)}</Text>
                    </View>
                    <View style={proposalsCellStyle}>
                        <Text>{proposal.serviceType4}</Text>
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

export const ConnectedProposal: React.FC<ProposalProps> = observer(({ proposal }) => {
    const { proposals } = useStores()
    const onToggle = (): void => proposals.toggleActiveProposal(proposal)
    const activeKey = proposals.active?.key
    return <Proposal proposal={proposal} activeKey={activeKey} onToggle={onToggle} />
})

export const ProposalTable: React.FC = observer(() => {
    const { proposals } = useStores()
    const items = proposals.countryFiltered
    return (
        <View
            style={`
            flex: 1;
            flex-direction: column;
            padding: 0;
            padding-top: 0;
            width: 562;
            background: "white";
            `}
        >
            <View
                style={`
                width: "100%";
                flex-direction: "column";
                `}
            >
                {items.map(p => {
                    return <ConnectedProposal key={p.key} proposal={p} />
                })}
            </View>
        </View>
    )
})
