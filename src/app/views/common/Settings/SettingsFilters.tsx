/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"

import { Heading2 } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { QualityFilter } from "../../../proposals/components/QualityFilter/QualityFilter"
import { ProposalQuality } from "../../../proposals/components/ProposalQuality/ProposalQuality"

const Title = styled(Heading2)`
    margin-bottom: 15px;
`

const Section = styled(ViewContent)`
    padding: 20px;
    margin-bottom: 10px;
`

const SectionIconWrap = styled.div`
    margin-bottom: 15px;
`

export const SettingsFilters: React.FC = observer(function SettingsFilters() {
    return (
        <>
            <Section>
                <SectionIconWrap>
                    <ProposalQuality level={2} color="#ffffff88" />
                </SectionIconWrap>
                <Title>Quality</Title>
                <QualityFilter />
            </Section>
        </>
    )
})
