/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { ChangeEvent, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { QualityLevel } from "mysterium-vpn-js"

import { useStores } from "../../../store"
import { Small } from "../../../ui-kit/typography"

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

const displayQuality = (q?: QualityLevel): string => {
    switch (q) {
        case QualityLevel.MEDIUM:
            return "Medium+"
        case QualityLevel.HIGH:
            return "High"
        default:
            return "Any"
    }
}

export const QualityFilter = observer(() => {
    const { proposals, filters } = useStores()
    const quality = filters.config.quality?.level
    const qualityText = displayQuality(quality)

    const [range, setRange] = useState<{ quality?: QualityLevel }>({ quality })
    useEffect(() => {
        setRange({ ...range, quality: filters.config.quality?.level })
    }, [filters.config.quality?.level])

    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const val = event.target.valueAsNumber
        proposals.setQualityFilter(val)
        setRange({ ...range, quality: val })
    }
    return (
        <Container>
            <RangeContainer>
                <Label>{qualityText}</Label>
                <Range type="range" min={0} max={2} value={range.quality} onChange={onChange} />
            </RangeContainer>
        </Container>
    )
})
