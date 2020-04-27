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
    padding: 0 12px;
`

const Title = styled.p`
    ${textSmall}
    color: #777;
`

const Range = styled.input``

const IncludeFailed = styled.div`
    margin: 12px 0;
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
            <Title>Quality: {qualityText}</Title>
            <Range type="range" min={0} max={2} defaultValue={quality} onChange={onChange} />
            <IncludeFailed>
                <Checkbox checked={includeFailed} onChange={(): void => proposals.setIncludeFailed(!includeFailed)}>
                    Include unreachable nodes
                </Checkbox>
            </IncludeFailed>
        </Container>
    )
})
