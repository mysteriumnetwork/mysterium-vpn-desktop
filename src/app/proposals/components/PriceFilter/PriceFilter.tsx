/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { ChangeEvent, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency } from "mysterium-vpn-js"

import { useStores } from "../../../store"
import { Small } from "../../../ui-kit/typography"
import { fmtMoney } from "../../../payment/display"

const Container = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
`

const RangeContainer = styled.div`
    height: 32px;
    margin-bottom: 16px;
`

const Label = styled(Small)`
    opacity: 0.7;
`

const Range = styled.input`
    width: 100%;
    margin: 10px 0;
`

const displayFilterPrice = (amount?: number): string => {
    if (!amount) {
        return "unlimited"
    }
    const priceDisplay = fmtMoney({
        amount: amount ?? 0,
        currency: Currency.MYSTTestToken,
    })
    return priceDisplay + " or less"
}

export const PriceFilter = observer(() => {
    const { proposals, filters } = useStores()

    const [price, setPrice] = useState<{ perHour?: number; perGib?: number }>({
        perHour: filters.config.price?.perhour,
        perGib: filters.config.price?.pergib,
    })
    useEffect(() => {
        setPrice({ ...price, perHour: filters.config.price?.perhour, perGib: filters.config.price?.pergib })
    }, [filters.config.price])

    const onPricePerHourChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const pricePerHour = event.target.valueAsNumber
        setPrice({ ...price, perHour: pricePerHour })
        await proposals.setPricePerHourMaxFilterDebounced(pricePerHour)
    }
    const onPricePerGiBChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const valueAsNumber = event.target.valueAsNumber
        setPrice({ ...price, perGib: valueAsNumber })
        await proposals.setPricePerGibMaxFilterDebounced(valueAsNumber)
    }
    return (
        <Container>
            <RangeContainer>
                <Label>Price/hour: {displayFilterPrice(price.perHour)}</Label>
                <Range
                    type="range"
                    min={0}
                    max={filters.priceCeiling?.perHourMax}
                    value={price.perHour}
                    step={1000}
                    onChange={onPricePerHourChange}
                />
            </RangeContainer>
            <RangeContainer>
                <Label>Price/GiB: {displayFilterPrice(price.perGib)}</Label>
                <Range
                    type="range"
                    min={0}
                    max={filters.priceCeiling?.perGibMax}
                    value={price.perGib}
                    step={1000}
                    onChange={onPricePerGiBChange}
                />
            </RangeContainer>
        </Container>
    )
})
