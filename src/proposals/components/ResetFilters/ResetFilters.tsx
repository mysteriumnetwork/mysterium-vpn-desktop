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

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`

export const ResetFilters = observer(() => {
    const { config } = useStores()

    return (
        <Container>
            <Anchor
                onClick={() => {
                    config.resetFilters()
                }}
            >
                Reset all filters
            </Anchor>
        </Container>
    )
})
