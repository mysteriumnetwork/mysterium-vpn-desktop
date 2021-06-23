/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../../store"
import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"
import { countryName, isUnknownCountry } from "../../../location/countries"
import { Flag } from "../../../location/components/Flag/Flag"
import { IconGlobe } from "../../../ui-kit/icons/IconGlobe"
import { brand } from "../../../ui-kit/colors"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    overflow-y: scroll;
`

const CountryToggle = styled(Toggle).attrs({
    activeShadowColor: "0px 5px 10px rgba(214, 31, 133, 0.2)",
})``

const CountryName = styled.div`
    margin-left: 10px;
`

const Count = styled.span`
    margin-left: auto;
`

export const CountryFilter = observer(() => {
    const { proposals } = useStores()
    const countryCounts = proposals.countryCounts
    if (!Object.keys(countryCounts).length) {
        return <></>
    }
    const sortedCountries = Object.keys(countryCounts).sort((self, other) => {
        if (isUnknownCountry(self)) {
            return 1
        }
        return countryName(self).localeCompare(countryName(other))
    })
    return (
        <Container>
            <CountryToggle
                key="all"
                onClick={() => proposals.setCountryFilter(undefined)}
                active={proposals.filter.country == null}
            >
                <IconGlobe color={proposals.filter.country == null ? "#fff" : brand} />
                <CountryName>All countries</CountryName>
                <Count>{proposals.textFiltered.length}</Count>
            </CountryToggle>
            {sortedCountries.map((countryCode) => {
                const toggleAction = (): void => {
                    proposals.toggleCountryFilter(countryCode)
                }
                return (
                    <CountryToggle
                        key={countryCode}
                        onClick={toggleAction}
                        active={proposals.filter.country == countryCode}
                    >
                        <Flag countryCode={countryCode} />
                        <CountryName>{countryName(countryCode)}</CountryName>
                        <Count>{countryCounts[countryCode]}</Count>
                    </CountryToggle>
                )
            })}
        </Container>
    )
})
