import React from "react"
import { useStores } from "../../store"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { Country } from "../../ui-kit/country/country"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { CursorShape } from "@nodegui/nodegui"

export type CountryFilterPureProps = {
    country: string
    count: number
    activeCountry?: string
    toggleAction: () => void
}

// eslint-disable-next-line react/display-name
const CountryFilterPure: React.FC<CountryFilterPureProps> = React.memo(
    ({ country, count, activeCountry, toggleAction }) => {
        const active = activeCountry === country
        return (
            <View key={country} style={`margin-top: 5;`} cursor={CursorShape.PointingHandCursor}>
                <Toggle key={country} width={220} height={28} active={active} onToggle={toggleAction}>
                    <View style={`padding-left: 10; padding-right: 10; width: 225; justify-content: "space-between";`}>
                        <Country
                            flagStyle={`top: 2;`}
                            textStyle={`color: ${active ? "white" : "inherit"}`}
                            code={country}
                            text
                        />
                        <Text style={`color: ${active ? "white" : "inherit"};`}>{count}</Text>
                    </View>
                </Toggle>
            </View>
        )
    },
    (prevProps, nextProps) => {
        return (
            prevProps.country === nextProps.country &&
            prevProps.count === nextProps.count &&
            ![prevProps.activeCountry, nextProps.activeCountry].includes(nextProps.country)
        )
    },
)
export const CountryFilter = observer(() => {
    const { proposals } = useStores()
    const countryCounts = proposals.byCountryCounts

    return (
        <View
            style={`
            font-size: 13px;
            background: #fafafa;
            
            flex-direction: column;
            padding: 2;
            width: "100%";
            border: 0;
            `}
        >
            <Text style={`color: #777; margin: 5;`}>By country</Text>
            {Object.keys(countryCounts)
                .sort()
                .map(countryCode => {
                    const toggleAction = (): void => {
                        proposals.toggleFilterCountry(countryCode)
                    }
                    return (
                        <CountryFilterPure
                            key={countryCode}
                            country={countryCode}
                            count={countryCounts[countryCode]}
                            activeCountry={proposals.filter.country}
                            toggleAction={toggleAction}
                        />
                    )
                })}
        </View>
    )
})
