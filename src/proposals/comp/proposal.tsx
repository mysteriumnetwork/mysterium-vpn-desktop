import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { UIProposal } from "../ui-proposal-type"
import { Proposal as ProposalType } from "mysterium-vpn-js/lib/proposal/proposal"
import { mystDisplay, pricePerGiB, pricePerMinute } from "mysterium-vpn-js"

const timeRate = (p: ProposalType): number | undefined => {
    if (!p.paymentMethod) {
        return undefined
    }
    return mystDisplay(pricePerMinute(p.paymentMethod))
}

const trafficRate = (p: ProposalType): number | undefined => {
    if (!p.paymentMethod) {
        return undefined
    }
    return mystDisplay(pricePerGiB(p.paymentMethod))
}

export type ProposalProps = {
    proposal: UIProposal
}

export const Proposal: React.FC<ProposalProps> = ({ proposal }) => {
    return (
        <View id="row">
            <View id="cell-id">
                <Text>{proposal.id10}</Text>
            </View>
            <View id="cell-price-per-min">
                <Text>{timeRate(proposal)}</Text>
            </View>
            <View id="cell-price-per-gib">
                <Text>{trafficRate(proposal)}</Text>
            </View>
            <View id="cell-service-type">
                <Text>{proposal.serviceType4}</Text>
            </View>
        </View>
    )
}
