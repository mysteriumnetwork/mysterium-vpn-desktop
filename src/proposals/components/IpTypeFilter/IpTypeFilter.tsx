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

import { useStores } from "../../../store"
import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
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
            {Object.keys(ipTypeCounts)
                .sort()
                .map((ipType) => {
                    const toggleAction = (): void => {
                        proposals.toggleIpTypeFilter(ipType)
                    }
                    const active = proposals.configFilters.other?.["ip-type"] === ipType
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
