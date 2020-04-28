/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCog, faCogs } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../store"
import { LightButton } from "../../ui-kit/mbutton/light-button"

const Button = styled(LightButton)`
    padding: 8px;
    height: 32px;
    min-height: 32px;
    font-size: 12px;
    color: #777;
    background: transparent;
    font-weight: 300;
    letter-spacing: initial;
    &:active {
        transform: none;
    }
`

export const FilterModeSwitch: React.FC = observer(() => {
    const { proposals } = useStores()
    const icon = proposals.customFilter ? faCogs : faCog
    const text = proposals.customFilter ? "Less filters" : "More filters"
    return (
        <Button onClick={(): void => proposals.toggleCustomFilter()}>
            {text} <FontAwesomeIcon icon={icon} />
        </Button>
    )
})
