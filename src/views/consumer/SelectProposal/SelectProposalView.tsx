/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import _ from "lodash"

import { CountryFilter } from "../../../proposals/components/CountryFilter/CountryFilter"
import { ProposalTable } from "../../../proposals/components/ProposalTable/ProposalTable"
import { SelectedProposal } from "../../../proposals/components/SelectedProposal/SelectedProposal"
import { useStores } from "../../../store"
import { Search } from "../../../ui-kit/form-components/Search"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"

const Sidebar = styled(ViewSidebar)`
    background: #fff;
`

const Content = styled(ViewContent)`
    background: #fff;
`

const Filters = styled.div`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
`

const ScrollArea = styled.div`
    flex: 1;
    overflow-y: scroll;
`

const MainBottom = styled.div`
    margin-top: auto;
    width: 100%;
`

const SearchNodeWrap = styled.div`
    width: 378px;
    height: 35px;
`

export const SelectProposalView: React.FC = observer(() => {
    const { proposals } = useStores()
    const searchDebounced = _.debounce((text): void => {
        proposals.setTextFilter(text)
    }, 500)
    return (
        <ViewContainer>
            <ViewNavBar>
                <SearchNodeWrap>
                    <Search onChange={searchDebounced} />
                </SearchNodeWrap>
            </ViewNavBar>
            <ViewSplit>
                <Sidebar>
                    <Filters>
                        <ScrollArea>
                            <CountryFilter />
                        </ScrollArea>
                    </Filters>
                </Sidebar>
                <Content>
                    <ProposalTable />
                    <MainBottom>
                        <SelectedProposal />
                    </MainBottom>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
