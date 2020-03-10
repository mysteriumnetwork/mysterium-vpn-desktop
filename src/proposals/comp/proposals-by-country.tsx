import React from "react"
import { useStores } from "../../store"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { Country } from "../../ui-kit/country/country"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { CursorShape } from "@nodegui/nodegui"

const styleSheet = `
#container {
    font-size: 13px;
    background: #fafafa;

    flex-direction: column;
    padding-left: 2;
    padding-right: 2;
    width: "100%";
    border: 0;
}
`

export const ProposalsByCountry = observer(() => {
    const { proposals } = useStores()
    const countryCounts = proposals.byCountryCounts
    return (
        <View id="container" styleSheet={styleSheet}>
            <Text style={`color: #777; margin: 5;`}>By country</Text>
            {Object.keys(countryCounts)
                .sort()
                .map(countryCode => {
                    return (
                        <View key={countryCode} style={`margin-top: 5;`} cursor={CursorShape.PointingHandCursor}>
                            <Toggle
                                key={countryCode}
                                width={230}
                                height={30}
                                active={proposals.filter.country === countryCode}
                                onToggle={(): void => {
                                    proposals.toggleFilterCountry = countryCode
                                }}
                            >
                                <View
                                    style={`padding-left: 10; padding-right: 10; width: 225; justify-content: "space-between";`}
                                >
                                    <Country textStyle={`font-size: 14px;`} code={countryCode} text />
                                    <Text>{countryCounts[countryCode]}</Text>
                                </View>
                            </Toggle>
                        </View>
                    )
                })}
        </View>
    )
})
