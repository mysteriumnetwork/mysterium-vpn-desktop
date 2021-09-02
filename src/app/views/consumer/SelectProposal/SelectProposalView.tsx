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
import { darkBlue } from "../../../ui-kit/colors"
import { Preset } from "../../../proposals/components/Preset/Preset"

const Content = styled(ViewContent)`
    background: #fff;
    color: ${darkBlue};
`

const SideTop = styled.div<{ presetCount: number }>`
    box-sizing: border-box;
    height: ${(props) => props.presetCount * 30 + 24}px;
    padding: 12px;
    overflow: hidden;
    text-align: center;
    flex-shrink: 0;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 12px 0;

    flex: 1;
    height: 350px;

    display: flex;
    flex-direction: column;
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
                <ViewSidebar>
                    <SideTop presetCount={proposals.filterPresets.length || 4}>
                        <Preset />
                    </SideTop>
                    <SideBot>
                        <CountryFilter />
                    </SideBot>
                </ViewSidebar>
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
