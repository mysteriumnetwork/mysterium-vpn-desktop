/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { Route } from "react-router-dom"

import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconPerson } from "../../../ui-kit/icons/IconPerson"
import { greyBlue1 } from "../../../ui-kit/colors"
import { Heading2, Small } from "../../../ui-kit/typography"
import { locations } from "../../../navigation/locations"

import { HelpContentReportIssue } from "./HelpContentReportIssue"

const SideTop = styled.div`
    flex: 1 0 auto;
    box-sizing: border-box;
    height: 124px;
    padding: 20px;
    overflow: hidden;
    text-align: center;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    height: 330px;
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Title = styled(Heading2)`
    margin: 15px 0;
`

const Content = styled(ViewContent)`
    padding: 20px 26px;
`

export const HelpView: React.FC = () => {
    return (
        <ViewContainer>
            <ViewNavBar />
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconPerson color={greyBlue1} />
                        <Title>Get help</Title>
                        <Small>Help using Mysterium VPN</Small>
                    </SideTop>
                    <SideBot />
                </ViewSidebar>
                <Content>
                    <Route path={locations.helpBugReport.path}>
                        <HelpContentReportIssue />
                    </Route>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
}
