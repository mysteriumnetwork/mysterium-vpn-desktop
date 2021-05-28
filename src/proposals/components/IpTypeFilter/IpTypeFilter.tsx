/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../../store"
import { Checkbox } from "../../../ui-kit/form-components/Checkbox/Checkbox"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

export const IpTypeFilter = observer(() => {
    const { proposals } = useStores()
    const ipTypeCounts = proposals.ipTypeCounts
    if (!Object.keys(ipTypeCounts).length) {
        return <></>
    }
    const residential = proposals.filters.other?.["ip-type"] == "residential"
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const checked = evt.target.checked
        proposals.setIpTypeFilter(checked ? "residential" : "")
    }
    return (
        <Container>
            <Checkbox checked={residential} onChange={handleChange}>
                Residential only
            </Checkbox>
        </Container>
    )
})
