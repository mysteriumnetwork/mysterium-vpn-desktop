import {Proposal as ProposalType} from "mysterium-vpn-js"
import {Button, useEventHandler, View} from "@nodegui/react-nodegui"
import React from "react"
import {observer} from "mobx-react-lite"
import {useStores} from "../store"
import {mystDisplay, pricePerGiB, pricePerMinute} from "mysterium-vpn-js"
import {UIProposal} from "./ui-proposal-type";

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

export const Proposal = observer((p: UIProposal) => {
    const {proposals} = useStores()
    const clickHandler = useEventHandler({
        ["clicked"]: () => {
            proposals.activate = p
        }
    }, [])

    const time = timeRate(p)
    const traffic = trafficRate(p)

    const displayText = [
        p.id10,
        p.serviceType4,
        time ? time + "/min" : undefined,
        traffic ? traffic + "/GiB" : undefined,
    ].filter(Boolean).join(" ")

    return (
        <View id="proposal" styleSheet={styleSheet}>
            <Button id="button" text={displayText} on={clickHandler}/>
        </View>
    )
})

const styleSheet = `
#proposal {
}
#proposal:hover {
}
#button {
    width: "100%";
    height: 40px;
    font-size: 12px;
    font-family: "Monaco, monospace";
    text-align: left;
    margin: 0;
    padding: 0;
    padding-left: 10;
    border: 0;
}
`
