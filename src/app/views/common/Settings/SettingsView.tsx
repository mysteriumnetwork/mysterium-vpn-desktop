/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import React from "react"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGlobe, faSlidersH, faUserAlt } from "@fortawesome/free-solid-svg-icons"

import { Heading2 } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { brandLight, greyBlue1, lightBlue } from "../../../ui-kit/colors"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { locations } from "../../../navigation/locations"
import { IconSettings } from "../../../ui-kit/icons/IconSettings"
import { AppVersion } from "../../../daemon/components/AppVersion"

const SideTop = styled.div`
    box-sizing: border-box;
    height: 136px;
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
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
`

const Title = styled(Heading2)`
    margin: 15px 0;
`

const Content = styled(ViewContent)`
    background: none;
`

const Version = styled(AppVersion)`
    margin-top: auto;
`

interface NavButtonProps {
    active: boolean
}

const NavButton = styled.button<NavButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>`
    min-width: 40px;
    height: 40px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: none;

    &:hover {
        background: ${(props) => (props.active ? greyBlue1 : "#aeaedb33")};
        color: ${(props) => (props.active ? "#fff" : "inherit")};
    }
    background: ${(props) => (props.active ? greyBlue1 : lightBlue)};
    color: ${(props) => (props.active ? "#fff" : greyBlue1)};

    svg {
        width: 40px !important;
    }
    text-align: left;
    font-size: 13px;
    line-height: 13px;
    display: flex;
    align-items: center;
`

export const SettingsView: React.FC = observer(function SettingsView() {
    const navigate = useNavigate()
    const location = useLocation()
    const isFilterTabActive = location.pathname == locations.settingsFilters
    const isConnectionTabActive = location.pathname == locations.settingsConnection
    const isMysteriumIdTabActive = location.pathname == locations.settingsMysteriumId
    return (
        <ViewContainer>
            <ViewNavBar />
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconSettings color={brandLight} />
                        <Title>Settings</Title>
                    </SideTop>
                    <SideBot>
                        <NavButton active={isFilterTabActive} onClick={() => navigate(locations.settingsFilters)}>
                            <FontAwesomeIcon icon={faSlidersH} />
                            Default filters
                        </NavButton>
                        <NavButton
                            active={isConnectionTabActive}
                            onClick={() => navigate(locations.settingsConnection)}
                        >
                            <FontAwesomeIcon icon={faGlobe} />
                            Connection
                        </NavButton>
                        <NavButton
                            active={isMysteriumIdTabActive}
                            onClick={() => navigate(locations.settingsMysteriumId)}
                        >
                            <FontAwesomeIcon icon={faUserAlt} />
                            Mysterium ID
                        </NavButton>
                        <Version />
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <Outlet />
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
