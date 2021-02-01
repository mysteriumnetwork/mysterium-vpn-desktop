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

import { CountryFilter } from "../../../proposals/components/CountryFilter/CountryFilter"
import { OriginalLocation } from "../../../location/components/OriginalLocation/OriginalLocation"
import { Search } from "../../../ui-kit/form-components/Search"
import { useStores } from "../../../store"
import { ProposalTable } from "../../../proposals/components/ProposalTable/ProposalTable"
import { SelectedProposal } from "../../../proposals/components/SelectedProposal/SelectedProposal"

const Container = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
`

const Sidebar = styled.div`
    height: 100%;
    width: 240px;
    min-width: 240px;
    display: flex;
    flex-direction: column;
`

const Main = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const Filters = styled.div`
    flex: 1;
    min-height: 0;
    padding: 0 0 0 8px;
    display: flex;
    flex-direction: column;
`

const SearchDiv = styled.div`
    padding: 16px 16px 0 16px;
`

const ScrollArea = styled.div`
    padding: 0 8px 8px 0;
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
                <Filters>
                    <ScrollArea>
                        <SearchDiv>
                            <Search onChange={searchDebounced} />
                        </SearchDiv>
                        <CountryFilter />
                    </ScrollArea>
                </Filters>
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
