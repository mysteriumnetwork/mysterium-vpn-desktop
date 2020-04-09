/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { CursorShape } from "@nodegui/nodegui"

import { useStores } from "../../store"
import { Country } from "../../ui-kit/country/country"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { textSmall } from "../../ui-kit/typography"
import { brand } from "../../ui-kit/colors"

export type CountryFilterPureProps = {
    country: string
    count: number
    activeCountry?: string
    toggleAction: () => void
}

const styleSheet = `
#CountryFilter {
    margin-top: 5;
}
#CountryFilter-Row-active {
    width: 220;
    height: 28;
    background: "${brand}";
    border-radius: 3px;
}
#CountryFilter-Row {
    width: 220;
    height: 28;
    border-radius: 3px;
}
#CountryFilter-Row:hover {
    background: #e6e6e6;
}
#CountryFilter-Row-Content {
    padding-left: 10;
    padding-right: 10;
    width: 225;
    flex-direction: "row";
    justify-content: "space-between";
}
`

// eslint-disable-next-line react/display-name
const CountryFilterPure: React.FC<CountryFilterPureProps> = React.memo(
    ({ country, count, activeCountry, toggleAction }) => {
        const active = activeCountry === country
        return (
            <View key={country} cursor={CursorShape.PointingHandCursor} id="CountryFilter" styleSheet={styleSheet}>
                <Toggle
                    id={active ? "CountryFilter-Row-active" : "CountryFilter-Row"}
                    key={country}
                    onToggle={toggleAction}
                >
                    <View id="CountryFilter-Row-Content">
                        <Country
                            containerStyle={`flex-direction: "row"; align-items: "center"; justify-content: "center";`}
                            textStyle={`height: 28; color: ${active ? "white" : "inherit"};`}
                            code={country}
                            text
                        />
                        <Text
                            style={`
                            height: 28;
                            qproperty-alignment: "AlignRight | AlignVCenter";
                            color: ${active ? "white" : "inherit"};
                            `}
                        >
                            {count}
                        </Text>
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
    const countryCounts = proposals.countryCounts
    if (!Object.keys(countryCounts).length) {
        return <></>
    }
    return (
        <View
            style={`
            width: "100%";
            padding: 2;
            background: #fafafa;
            border: 0;
            flex-direction: column;
            `}
        >
            <Text
                style={`
                ${textSmall}
                color: #777;
                margin: 5;
            `}
            >
                By country
            </Text>
            {Object.keys(countryCounts)
                .sort()
                .map((countryCode) => {
                    const toggleAction = (): void => {
                        proposals.toggleCountryFilter(countryCode)
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
