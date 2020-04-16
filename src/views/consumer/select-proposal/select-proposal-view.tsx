/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { CountryFilter } from "../../../proposals/comp/country-filter"
import { OriginalLocation } from "../../../location/comp/original-location"

const Container = styled.div`
    flex: 1;
    display: flex;
    overflow: hidden;
`

const Sidebar = styled.div`
    height: 100%;
    width: 240px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
`

const Main = styled.div`
    background: cyan;
`

const ScrollArea = styled.div`
    flex: 1;
    overflow-y: scroll;
`

export const SelectProposalView: React.FC = observer(() => {
    // const { proposals } = useStores()
    // const searchDebounced = _.debounce((text): void => {
    //     proposals.setTextFilter(text)
    // }, 500)
    return (
        <Container>
            <Sidebar>
                <ScrollArea>
                    <CountryFilter />
                </ScrollArea>
                <OriginalLocation />
            </Sidebar>
            <Main></Main>
        </Container>
        /*<View
            style={`
                ${style}
                flex-direction: "column";
            `}
            {...rest}
        >
            <NavBar />
            <View
                style={`
                width: ${winSize.width};
                height: ${winSize.height - 40};
                flex-direction: "row";
            `}
            >
                <View
                    style={`
                    width: 240;
                    flex-direction: "column";
                    background: #fafafa;
                `}
                >
                    <View
                        style={`
                        padding: 8;
                        `}
                    >
                        <Search width={224} height={24} onChange={searchDebounced} />
                    </View>
                    <ScrollArea
                        style={`
                        flex: 1;
                        background-color: #ecf0f1;
                        border: 0;
                        border-right: 1px solid #e9e9e9;
                    `}
                    >
                        <View
                            style={`
                            padding-bottom: 15;
                            background: #fafafa;
                            flex-direction: "column";
                        `}
                        >
                            <IpTypeFilter />
                            <CountryFilter />
                        </View>
                    </ScrollArea>
                    <View
                        style={`
                        height: 65;
                        background: #fafafa;
                        border-top: 1px solid #e9e9e9;
                        border-right: 1px solid #e9e9e9;
                    `}
                    >
                        <OriginalLocation />
                    </View>
                </View>
                <View
                    style={`
                    width: ${winSize.width - 240};
                    flex-direction: "column";
                    background: #fff;
                `}
                >
                    <ProposalTable />
                    <View
                        style={`
                        max-height: 65;
                        border-top: 1px solid #e9e9e9;
                    `}
                    >
                        <SelectedProposal />
                    </View>
                </View>
            </View>
        </View>*/
    )
})
