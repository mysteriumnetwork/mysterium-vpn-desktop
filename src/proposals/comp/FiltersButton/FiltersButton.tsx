/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCogs } from "@fortawesome/free-solid-svg-icons"

import { NavToggle } from "../../../ui-kit/toggle/nav-toggle"
import { useStores } from "../../../store"
import { brandDarker } from "../../../ui-kit/colors"

const FilterToggle = styled(NavToggle)`
    padding: 0 8px;
`

const Icon = styled.div`
    height: 100%;
    padding-right: 8px;
    line-height: 24px;
`

export const FiltersButton: React.FC = observer(() => {
    const { navigation } = useStores()
    const active = navigation.filters
    const onClick = (): void => {
        navigation.toggleFilters()
    }
    return (
        <FilterToggle onClick={onClick} active={active}>
            <Icon>
                <FontAwesomeIcon icon={faCogs} color={active ? "#fff" : brandDarker} />
            </Icon>
            <span>Filters</span>
        </FilterToggle>
    )
})
