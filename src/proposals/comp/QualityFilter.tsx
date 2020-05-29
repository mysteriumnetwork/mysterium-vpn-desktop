/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { ChangeEvent } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { QualityLevel } from "mysterium-vpn-js"

import { useStores } from "../../store"
import { textSmall } from "../../ui-kit/typography"
import { Checkbox } from "../../ui-kit/Checkbox/Checkbox"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

const RangeContainer = styled.div`
    height: 32px;
    margin-bottom: 8px;
`

const Label = styled.div`
    ${textSmall}
    color: #404040;
    line-height: 16px;
`

const Range = styled.input`
    width: 100%;
`

const IncludeFailed = styled.div`
    ${textSmall}
    height: 32px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
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
    const { proposals } = useStores()
    const quality = proposals.filter.quality
    const qualityText = displayQuality(quality)
    const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const val = event.target.valueAsNumber
        proposals.setQualityFilter(val)
    }
    const includeFailed = proposals.filter.includeFailed
    return (
        <Container>
            <RangeContainer>
                <Label>{qualityText}</Label>
                <Range type="range" min={0} max={2} defaultValue={quality} onChange={onChange} />
            </RangeContainer>
            <IncludeFailed>
                <Checkbox checked={includeFailed} onChange={(): void => proposals.setIncludeFailed(!includeFailed)}>
                    Include unreachable
                </Checkbox>
            </IncludeFailed>
        </Container>
    )
})
