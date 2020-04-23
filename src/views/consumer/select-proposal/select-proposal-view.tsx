/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import * as _ from "lodash"

import { CountryFilter } from "../../../proposals/comp/CountryFilter"
import { OriginalLocation } from "../../../location/comp/original-location"
import { Search } from "../../../ui-kit/search/search"
import { useStores } from "../../../store"
import { IpTypeFilter } from "../../../proposals/comp/IpTypeFilter"
import { ProposalTable } from "../../../proposals/comp/ProposalTable/ProposalTable"
import { SelectedProposal } from "../../../proposals/comp/SelectedProposal"
import { QualityFilter } from "../../../proposals/comp/QualityFilter"

const Container = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
`

const Sidebar = styled.div`
    height: 100%;
    min-width: 240px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
`

const Main = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const ScrollArea = styled.div`
    flex: 1;
    overflow-y: scroll;
`

const MainBottom = styled.div`
    margin-top: auto;
`

export const SelectProposalView: React.FC = observer(() => {
    const { proposals } = useStores()
    const searchDebounced = _.debounce((text): void => {
        proposals.setTextFilter(text)
    }, 500)
    return (
        <Container>
            <Sidebar>
                <Search onChange={searchDebounced} />
                <ScrollArea>
                    <QualityFilter />
                    <IpTypeFilter />
                    <CountryFilter />
                </ScrollArea>
                <OriginalLocation />
            </Sidebar>
            <Main>
                <ProposalTable />
                <MainBottom>
                    <SelectedProposal />
                </MainBottom>
            </Main>
        </Container>
    )
})
