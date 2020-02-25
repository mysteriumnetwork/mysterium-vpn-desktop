import {Proposal as ProposalType} from "mysterium-vpn-js/lib/proposal/proposal";
import {Text, View} from "@nodegui/react-nodegui";
import React from "react";

export const Proposal = (p: Partial<ProposalType>) => {
    const key = `${p.providerId}|${p.serviceType}`
    return (
        <View key={key} id="proposal" styleSheet={styleSheet}>
            <Text id="text">{key}</Text>
        </View>
    )
}

const styleSheet = `
#proposal {
    border-radius: 5px;
    margin-bottom: 5px;
}
#proposal:hover {
    
}
#text {
    color: #222;
    height: 30px;
    padding: 7px;
    border-radius: 5px;
}
#text:hover {
    color: #f0f0f0;
       background-color: #b2005e;
       padding: 7px;
}

`
