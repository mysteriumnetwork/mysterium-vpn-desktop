/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { ChangeEvent } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency, displayMoney } from "mysterium-vpn-js"
import * as _ from "lodash"

import { useStores } from "../../store"
import { textCaption, textSmall } from "../../ui-kit/typography"

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
    margin-bottom: 8px;
`

const RangeContainer = styled.div`
    height: 32px;
    padding: 0 16px;
    margin-bottom: 16px;
`

const Label = styled.div`
    ${textSmall}
    color: #404040;
    line-height: 16px;
`

const Range = styled.input`
    width: 100%;
`

const displayFilterPrice = (amount?: number): string => {
    if (!amount) {
        return "free"
    }
    const pricePerGibDisplay = displayMoney({
        amount: amount ?? 0,
        currency: Currency.MYSTTestToken,
    })
    return pricePerGibDisplay + " or less"
}

export const PriceFilter = observer(() => {
    const { proposals } = useStores()
    const { perMinuteMax, perGibMax } = proposals.priceMaximums
    if (!perMinuteMax || !perGibMax) {
        return <></>
    }

    const changePerMinuteMaxDebounced = _.debounce((val: number) => {
        proposals.setPricePerMinuteMaxFilter(val)
    }, 500)
    const changePerGibMaxDebounced = _.debounce((val: number) => {
        proposals.setPricePerGibMaxFilter(val)
    }, 500)
    return (
        <Container>
            <Title>Price</Title>
            <RangeContainer>
                <Label>Price/minute: {displayFilterPrice(proposals.filter.pricePerMinuteMax)}</Label>
                <Range
                    type="range"
                    min={0}
                    max={perMinuteMax}
                    defaultValue={proposals.filter.pricePerMinuteMax ?? 0}
                    step={1000}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                        changePerMinuteMaxDebounced(event.target.valueAsNumber)
                    }}
                />
            </RangeContainer>
            <RangeContainer>
                <Label>Price/GiB: {displayFilterPrice(proposals.filter.pricePerGibMax)}</Label>
                <Range
                    type="range"
                    min={0}
                    max={proposals.priceMaximums.perGibMax}
                    defaultValue={proposals.filter.pricePerGibMax ?? 0}
                    step={1000}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                        changePerGibMaxDebounced(event.target.valueAsNumber)
                    }}
                />
            </RangeContainer>
        </Container>
    )
})
