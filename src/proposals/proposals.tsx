import React from "react";
import {useStores} from "../store";
import {View, Text} from "@nodegui/react-nodegui";
import {observer} from "mobx-react-lite";
import {Proposal} from "./proposal";

export const Proposals = observer(() => {
    const {proposals} = useStores()
    const byCountry = proposals.byCountry;
    return (
        <View id="container" styleSheet={styleSheet}>
            {Object.keys(byCountry).map(country => (
                <View>
                    <Text id="country" >{country}</Text>
                    {byCountry[country].map(p => <Proposal {...p}/>)}
                </View>
            ))}
        </View>
    )
})


const styleSheet = `
#container {
    padding: 7px;
}
#country {
    margin: 5px;
}
`
