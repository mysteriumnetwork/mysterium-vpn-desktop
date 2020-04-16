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
import { Toggle, ToggleProps } from "../../ui-kit/toggle/toggle"
import { textSmall } from "../../ui-kit/typography"
import { resolveCountry } from "../../location/countries"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

const Title = styled.p`
    ${textSmall}
    color: #777;
    margin: 12px;
    margin-left: 12px;
`

const CountryToggle = styled(Toggle)`
    height: 28px;
    width: calc(100% - 4px);
    margin: 2px;
    border-radius: 4px;
    justify-content: flex-start;
    background: ${(props: ToggleProps): string =>
        props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "transparent"};
    &:hover {
        background: ${(props: ToggleProps): string =>
            props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "#e6e6e6"};
    }
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
    return (
        <Container>
            <Title>By country</Title>
            {Object.keys(countryCounts)
                .sort()
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
                            <Flag src={country.flag} alt={country.name} />
                            <p>{country.name}</p>
                            <Count>{countryCounts[countryCode]}</Count>
                        </CountryToggle>
                    )
                })}
        </Container>
    )
})
