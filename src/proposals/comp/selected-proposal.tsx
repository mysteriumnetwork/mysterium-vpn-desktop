import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { Proposal as ProposalType } from "mysterium-vpn-js/lib/proposal/proposal"
import { mystDisplay, pricePerGiB, pricePerMinute } from "mysterium-vpn-js"
import { observer } from "mobx-react-lite"
import { useStores } from "../../store"
import { Country } from "../../ui-kit/country/country"
import { MButton } from "../../ui-kit/mbutton/mbutton"

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

export const SelectedProposal: React.FC = observer(() => {
    const { proposals, connection } = useStores()
    const proposal = proposals.active
    if (!proposal) {
        return <></>
    }
    const pricingText = `${timeRate(proposal)}/min ${trafficRate(proposal)}/GiB`
    const connectAction = (): Promise<void> => connection.connect()
    return (
        <View style={`flex: 1;`}>
            <View style={`padding: 15;`}>
                <Country code={proposal.country} text={false} />
            </View>
            <View
                style={`
                flex-direction: "column";
                justify-content: "center";
                `}
            >
                <Text style={`font-weight: bold;`}>{proposal.id10}</Text>
                <Text>{pricingText}</Text>
            </View>
            <View
                style={`
                flex: 1; 
                justify-content: "flex-end";
                padding: 15;
                `}
            >
                <MButton text="Connect" onClick={connectAction} />
            </View>
        </View>
    )
})
