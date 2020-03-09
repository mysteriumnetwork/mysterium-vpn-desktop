import React from "react";
import {useStores} from "../store";
import {View} from "@nodegui/react-nodegui";
import {observer} from "mobx-react-lite";
import {Proposal} from "./proposal";
import {Collapse} from "../ui-kit/collapse/collapse";
import {Country} from "../ui-kit/country/country";

export const Proposals = observer(() => {
    const {proposals} = useStores()
    const byCountry = proposals.byCountry;
    return (
        <View id="container" styleSheet={styleSheet}>
            {Object.keys(byCountry).sort().map(countryCode => {
                return (
                    <Collapse
                        initiallyCollapsed
                        header={
                            <View style={`padding-top: 5; padding-bottom: 5; padding-left: 15;`}>
                                <Country
                                    textStyle={`font-size: 14px; color: #444;`}
                                    code={countryCode}
                                />
                            </View>
                        }
                        content={
                            <View id="country-proposals">
                                {byCountry[countryCode].map(p => {
                                    return (
                                        <Proposal key={`${p.providerId}${p.serviceType}`} {...p}/>
                                    )
                                })}
                            </View>
                        }
                    />)
            })}
        </View>
    )
})


const styleSheet = `
#container {
    font-size: 13px;
    background: #fafafa;

    flex-direction: column;
    padding: 0;
    padding-top: 0;
    width: "100%";
}
#country-container {
    flex-direction: column;
}
#country {
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
