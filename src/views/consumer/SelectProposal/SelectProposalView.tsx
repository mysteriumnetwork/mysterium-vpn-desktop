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
import { LogoTitle } from "../../../ui-kit/components/LogoTitle/LogoTitle"
import { useStores } from "../../../store"
import { Search } from "../../../ui-kit/form-components/Search"
import { bg1, darkBlue } from "../../../ui-kit/colors"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${bg1};
    padding: 15px;
    color: ${darkBlue};
`

const Split = styled.div`
    display: flex;
    height: 486px;
`

const Top = styled.div`
    height: 28px;
    padding-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Sidebar = styled.div`
    height: 100%;
    width: 222px;
    min-width: 222px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
`

const Main = styled.div`
    width: 378px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
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
        <Container>
            <Top>
                <LogoTitle />
                <SearchNodeWrap>
                    <Search onChange={searchDebounced} />
                </SearchNodeWrap>
            </Top>
            <Split>
                <Sidebar>
                    <Filters>
                        <ScrollArea>
                            <CountryFilter />
                        </ScrollArea>
                    </Filters>
                </Sidebar>
                <Main>
                    <ProposalTable />
                    <MainBottom>
                        <SelectedProposal />
                    </MainBottom>
                </Main>
            </Split>
        </Container>
    )
})
