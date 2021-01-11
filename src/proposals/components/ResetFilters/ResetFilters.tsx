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

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`

const Link = styled.div`
    cursor: pointer;
    color: #0000ee;
`

export const ResetFilters = observer(() => {
    const { proposals } = useStores()

    return (
        <Container>
            <Link
                onClick={() => {
                    proposals.resetFiltersToDefaults()
                }}
            >
                Reset all filters
            </Link>
        </Container>
    )
})
