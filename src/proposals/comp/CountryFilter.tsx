/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../store"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { textCaption } from "../../ui-kit/typography"
import { resolveCountry } from "../../location/countries"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

const Title = styled.div`
    height: 32px;
    margin-left: 8px;

    ${textCaption}
    color: #777;
    display: flex;
    align-items: center;
`

const Flag = styled.img`
    margin-right: 6px;
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
    return (
        <Container>
            <Title>Country</Title>
            {Object.keys(countryCounts)
                .sort()
                .map((countryCode) => {
                    const toggleAction = (): void => {
                        proposals.toggleCountryFilter(countryCode)
                    }
                    const country = resolveCountry(countryCode)
                    return (
                        <Toggle
                            key={countryCode}
                            onClick={toggleAction}
                            active={proposals.filter.country == countryCode}
                        >
                            <Flag src={country.flag} alt={country.name} />
                            <p>{country.name}</p>
                            <Count>{countryCounts[countryCode]}</Count>
                        </Toggle>
                    )
                })}
        </Container>
    )
})
