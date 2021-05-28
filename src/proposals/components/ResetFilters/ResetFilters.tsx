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
import { Anchor } from "../../../ui-kit/components/Anchor"
import { userEvent } from "../../../analytics/analytics"
import { ProposalViewAction } from "../../../analytics/actions"

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`

export const ResetFilters = observer(() => {
    const { filters, proposals } = useStores()

    const handleReset = async () => {
        userEvent(ProposalViewAction.FilterReset)
        await filters.reset()
        await proposals.fetchProposals()
    }
    return (
        <Container>
            <Anchor onClick={handleReset}>Reset all filters</Anchor>
        </Container>
    )
})
