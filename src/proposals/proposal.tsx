import {Proposal as ProposalType} from "mysterium-vpn-js/lib/proposal/proposal";
import {Button, useEventHandler, View} from "@nodegui/react-nodegui";
import React from "react";

export const Proposal = (p: Partial<ProposalType>) => {
    const clickHandler = useEventHandler({
        ['clicked']: () => {
            console.log('clicked')
        }
    }, [])
    const key = `${p.providerId}|${p.serviceType}`
    return (
        <View key={key} id="proposal" styleSheet={styleSheet}>
            <Button id="button" text={key} on={clickHandler}/>
        </View>
    )
}

const styleSheet = `
#proposal {
    width: 390px;
    border-radius: 5px;
    margin-bottom: 5px;
}
#button {
    font-size: 12px;
    font-family: "Monaco, monospace";
    text-align: left;
    color: #222;
    height: 30px;
    padding: 7px;
    border-radius: 5px;
}
#button:hover {
    color: #f0f0f0;
    background-color: #b2005e;
    padding: 7px;
}
`
