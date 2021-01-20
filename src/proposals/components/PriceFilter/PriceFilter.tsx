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
import { textSmall } from "../../../ui-kit/typography"
import { fmtMoney } from "../../../payment/display"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

const RangeContainer = styled.div`
    height: 32px;
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
    const pricePerGibDisplay = fmtMoney({
        amount: amount ?? 0,
        currency: Currency.MYSTTestToken,
    })
    return pricePerGibDisplay + " or less"
}

export const PriceFilter = observer(() => {
    const { proposals, config } = useStores()
    const { perMinuteMax, perGibMax } = config.priceCeiling

    const [price, setPrice] = useState<{ perMinute?: number; perGib?: number }>({
        perMinute: config.filters.price?.perminute,
        perGib: config.filters.price?.pergib,
    })
    useEffect(() => {
        setPrice({ ...price, perMinute: config.filters.price?.perminute, perGib: config.filters.price?.pergib })
    }, [config.filters.price])

    if (!perMinuteMax || !perGibMax) {
        return <></>
    }

    return (
        <Container>
            <RangeContainer>
                <Label>Price/minute: {displayFilterPrice(price.perMinute)}</Label>
                <Range
                    type="range"
                    min={0}
                    max={perMinuteMax}
                    value={price.perMinute}
                    step={1000}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                        const pricePerMinute = event.target.valueAsNumber
                        setPrice({ ...price, perMinute: pricePerMinute })
                        proposals.setPricePerMinuteMaxFilterDebounced(pricePerMinute)
                    }}
                />
            </RangeContainer>
            <RangeContainer>
                <Label>Price/GiB: {displayFilterPrice(price.perGib)}</Label>
                <Range
                    type="range"
                    min={0}
                    max={perGibMax}
                    value={price.perGib}
                    step={1000}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                        const valueAsNumber = event.target.valueAsNumber
                        setPrice({ ...price, perGib: valueAsNumber })
                        proposals.setPricePerGibMaxFilterDebounced(valueAsNumber)
                    }}
                />
            </RangeContainer>
        </Container>
    )
})
