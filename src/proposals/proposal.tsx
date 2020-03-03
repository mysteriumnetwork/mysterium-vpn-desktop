import {Proposal as ProposalType} from "mysterium-vpn-js/lib/proposal/proposal";
import {Button, useEventHandler, View} from "@nodegui/react-nodegui";
import React from "react";
import {observer} from "mobx-react-lite";
import {useStores} from "../store";

export const Proposal = observer((p: ProposalType) => {
    const { proposals } = useStores()
    const clickHandler = useEventHandler({
        ["clicked"]: () => {
            proposals.activate = p
        }
    }, [])
    const key = `${p.providerId}|${p.serviceType}`
    return (
        <View key={key} id="proposal" styleSheet={styleSheet}>
            <Button id="button" text={key} on={clickHandler}/>
        </View>
    )
})

const styleSheet = `
#proposal {
    width: 390px;
    margin-bottom: 3px;
    border-left: 5px solid transparent;
}
#proposal:hover {
    background: #8f9c9d;
    color: #f0f0f0;
    border-left: 5px solid #ecf0f1;
}
#button {
    font-size: 12px;
    font-family: "Monaco, monospace";
    text-align: left;
    color: #f0f0f0;
    padding: 5px;
    padding-left: 5px;
    padding-bottom: 5px;
    border-radius: 5px;
}
`
