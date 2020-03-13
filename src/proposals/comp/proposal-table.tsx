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

export const Proposal: React.FC<ProposalProps> = observer(({ proposal }) => {
    const { proposals } = useStores()
    const onToggle = (): void => proposals.toggleActiveProposal(proposal)
    return (
        <Toggle width={532} height={35} active={proposals.active?.key === proposal.key} onToggle={onToggle}>
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
                    return <Proposal key={p.key} proposal={p} />
                })}
            </View>
        </View>
    )
})
