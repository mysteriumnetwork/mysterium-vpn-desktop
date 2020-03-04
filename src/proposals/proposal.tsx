import {Proposal as ProposalType} from "mysterium-vpn-js/lib/proposal/proposal"
import {Button, useEventHandler, View} from "@nodegui/react-nodegui"
import React from "react"
import {observer} from "mobx-react-lite"
import {useStores} from "../store"
import {mystDisplay, pricePerGiB, pricePerMinute} from "mysterium-vpn-js"

const id10 = (id: string): string => id.substr(0, 10)

const serviceType4 = (serviceType: string): string => {
    switch (serviceType) {
        case "openvpn": {
            return "ovpn"
        }
        case "wireguard": {
            return "wgrd"
        }
    }
    return serviceType.substr(0, 4)
}

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


export const Proposal = observer((p: ProposalType) => {
    const {proposals} = useStores()
    const clickHandler = useEventHandler({
        ["clicked"]: () => {
            proposals.activate = p
        }
    }, [])

    const time = timeRate(p)
    const traffic = trafficRate(p)

    const key = [
        id10(p.providerId),
        serviceType4(p.serviceType),
        time ? time + "/min" : undefined,
        traffic ? traffic + "/GiB" : undefined,
    ].filter(Boolean).join(" ")

    return (
        <View key={key} id="proposal" styleSheet={styleSheet}>
            <Button id="button" text={key} on={clickHandler}/>
        </View>
    )
})

const styleSheet = `
#proposal {
    width: 294;
    margin: 0;
    padding: 0;
}
#proposal:hover {
    background: #4f5c5d;
}
#button {
    width: 289;
    height: 40px;
    font-size: 12px;
    font-family: "Monaco, monospace";
    text-align: left;
    color: #f0f0f0;
    margin: 0;
    padding: 0;
    padding-left: 10;
    border: 0;
}
`
