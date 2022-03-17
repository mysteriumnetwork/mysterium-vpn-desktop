/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"

import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"
import { useStores } from "../../../store"
import { IconMedia } from "../../../ui-kit/icons/IconMedia"
import { brandLight } from "../../../ui-kit/colors"
import { IconProps } from "../../../ui-kit/icons/Props"
import { IconBrowsing } from "../../../ui-kit/icons/IconBrowsing"
import { IconDownload } from "../../../ui-kit/icons/IconDownload"
import { IconNoPreset } from "../../../ui-kit/icons/IconNoPreset"

const Container = styled.div``

const PresetToggle = styled(Toggle).attrs({
    activeShadowColor: "0px 5px 10px rgba(214, 31, 133, 0.2)",
})`
    svg {
        margin-right: 10px;
    }
`

const PresetIcons: { [key: string]: React.FC<IconProps> | undefined } = {
    "Media Streaming": IconMedia,
    Browsing: IconBrowsing,
    Download: IconDownload,
    "All nodes": IconNoPreset,
}

export const Preset: React.FC = observer(function Preset() {
    const { proposals, filters } = useStores()
    if (!proposals.filterPresets) {
        return <></>
    }
    const togglePreset = (id: number): Promise<void> => {
        return proposals.toggleFilterPreset(id)
    }
    const isActive = (id: number): boolean => {
        return (filters.config.preset?.id ?? 0) == id
    }
    return (
        <Container>
            {proposals.filterPresets.map((p) => {
                const Icon = PresetIcons[p.name] || IconNoPreset
                return (
                    <PresetToggle key={p.id} onClick={() => togglePreset(p.id)} active={isActive(p.id)}>
                        <Icon color={isActive(p.id) ? "#fff" : brandLight} /> {p.name}
                    </PresetToggle>
                )
            })}
        </Container>
    )
})
