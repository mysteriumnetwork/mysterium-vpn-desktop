import React from "react";
import {useStores} from "../store";
import {View} from "@nodegui/react-nodegui";
import {observer} from "mobx-react-lite";
import {Proposal} from "./proposal";
import {Country} from "../ui-kit/country/country";

export const Proposals = observer(() => {
    const {proposals} = useStores()
    const byCountry = proposals.byCountry;
    return (
        <View id="container" styleSheet={styleSheet}>
            {Object.keys(byCountry).sort().map(countryCode => {
                return (
                    <View id="country-container" key={countryCode}>
                        <View id="country">
                            <Country code={countryCode} flag/>
                        </View>
                        <View id="country-proposals">
                            {byCountry[countryCode].map(p => {
                                return (
                                    <Proposal key={`${p.providerId}${p.serviceType}`} {...p}/>
                                )
                            })}
                        </View>
                    </View>
                )
            })}
        </View>
    )
})


const styleSheet = `
#container {
    font-size: 12px;
    background: #6f7c7d;

    flex-direction: column;
    padding: 0;
    padding-top: 0;
    padding-bottom: 27;
}
#country-container {
    flex-direction: column;
}
#country {
    background: #7f8c8d;
    padding: 10;
    height: 40px;
    border-bottom: 1px solid #666;
    border-top: 1px solid #656565;
    align-items: "center";
}
#country-proposals {
    flex-direction: column;
}
`
