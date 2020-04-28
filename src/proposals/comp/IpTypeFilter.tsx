/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import * as _ from "lodash"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../store"
import { textCaption } from "../../ui-kit/typography"
import { Toggle } from "../../ui-kit/toggle/toggle"

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

const Count = styled.span`
    margin-left: auto;
`

export const IpTypeFilter = observer(() => {
    const { proposals } = useStores()
    const ipTypeCounts = proposals.ipTypeCounts
    if (!Object.keys(ipTypeCounts).length) {
        return <></>
    }
    return (
        <Container>
            <Title>IP type</Title>
            {Object.keys(ipTypeCounts)
                .sort()
                .map((ipType) => {
                    const toggleAction = (): void => {
                        proposals.toggleIpTypeFilter(ipType)
                    }
                    const active = proposals.filter.ipType === ipType
                    const count = ipTypeCounts[ipType]
                    const ipTypeDisplay = _.capitalize(ipType)
                    return (
                        <Toggle key={ipType} onClick={toggleAction} active={active}>
                            {ipTypeDisplay}
                            <Count>{count}</Count>
                        </Toggle>
                    )
                })}
        </Container>
    )
})
