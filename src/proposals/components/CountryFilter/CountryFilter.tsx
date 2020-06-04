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
import { resolveCountry, unknownCountry } from "../../../location/countries"
import { Flag } from "../../../location/components/Flag/Flag"
import { SectionTitle } from "../../../ui-kit/components/SectionTitle/SectionTitle"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

const Count = styled.span`
    margin-left: auto;
`

const FilterFlag = styled(Flag)`
    margin-right: 8px;
`

const SidebarTitle = styled(SectionTitle)`
    height: 32px;
    margin-left: 8px;
`

const CountryToggle = styled(Toggle)`
    padding: 0 16px;
    line-height: 32px;
`

export const CountryFilter = observer(() => {
    const { proposals } = useStores()
    const countryCounts = proposals.countryCounts
    if (!Object.keys(countryCounts).length) {
        return <></>
    }
    return (
        <Container>
            <SidebarTitle>Country</SidebarTitle>
            {Object.keys(countryCounts)
                .sort((self, other) => {
                    const selfName = resolveCountry(self).name
                    const otherName = resolveCountry(other).name
                    if (selfName == unknownCountry.name) {
                        return 1
                    }
                    return selfName.localeCompare(otherName)
                })
                .map((countryCode) => {
                    const toggleAction = (): void => {
                        proposals.toggleCountryFilter(countryCode)
                    }
                    const country = resolveCountry(countryCode)
                    return (
                        <CountryToggle
                            key={countryCode}
                            onClick={toggleAction}
                            active={proposals.filter.country == countryCode}
                        >
                            <FilterFlag countryCode={countryCode} />
                            <p>{country.name}</p>
                            <Count>{countryCounts[countryCode]}</Count>
                        </CountryToggle>
                    )
                })}
        </Container>
    )
})
