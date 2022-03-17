/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faFacebookSquare, faReddit, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { shell } from "electron"
import { faBook, faBug, faComments, faFileContract } from "@fortawesome/free-solid-svg-icons"

import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconPerson } from "../../../ui-kit/icons/IconPerson"
import { brandLight, darkBlue, greyBlue1, lightBlue } from "../../../ui-kit/colors"
import { Heading2, Small } from "../../../ui-kit/typography"
import { locations } from "../../../navigation/locations"
import { useStores } from "../../../store"
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
    padding: 20px 26px;
`

const SocialButtons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: auto;
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
`

const IconButton = styled.button<NavButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>`
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
`

const SupportChatButton = styled.button`
    height: 40px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: none;

    background: ${darkBlue};
    color: #fff;

    &:enabled:hover {
        filter: brightness(115%);
    }
    & svg {
        width: 40px !important;
    }
    text-align: left;
`

export const HelpView: React.FC = observer(function HelpView() {
    const { navigation } = useStores()
    const navigate = useNavigate()
    const location = useLocation()
    const isBugReportActive = location.pathname.includes(locations.helpBugReport)
    const isTermsAndConditionsActive = location.pathname.includes(locations.helpTermsAndConditions)
    return (
        <ViewContainer>
            <ViewNavBar />
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconPerson color={brandLight} />
                        <Title>Get help</Title>
                        <Small>Help using Mysterium VPN</Small>
                    </SideTop>
                    <SideBot>
                        <SupportChatButton onClick={() => navigation.openChat()}>
                            <FontAwesomeIcon icon={faComments} />
                            Support chat
                        </SupportChatButton>
                        <NavButton active={isBugReportActive} onClick={() => navigate(locations.helpBugReport)}>
                            <FontAwesomeIcon icon={faBug} />
                            Bug report
                        </NavButton>
                        <NavButton
                            active={isTermsAndConditionsActive}
                            onClick={() => navigate(locations.helpTermsAndConditions)}
                        >
                            <FontAwesomeIcon icon={faFileContract} />
                            Terms & Conditions
                        </NavButton>
                        <NavButton active={false} onClick={() => shell.openExternal("https://docs.mysterium.network")}>
                            <FontAwesomeIcon icon={faBook} />
                            Documentation
                        </NavButton>
                        <SocialButtons>
                            <IconButton
                                active={false}
                                onClick={() => {
                                    shell.openExternal("https://discordapp.com/invite/n3vtSwc")
                                }}
                            >
                                <FontAwesomeIcon icon={faDiscord} size="2x" />
                            </IconButton>
                            <IconButton
                                active={false}
                                onClick={() => {
                                    shell.openExternal("https://www.reddit.com/r/MysteriumNetwork/")
                                }}
                            >
                                <FontAwesomeIcon icon={faReddit} size="2x" />
                            </IconButton>
                            <IconButton active={false}>
                                <FontAwesomeIcon
                                    icon={faTwitter}
                                    size="2x"
                                    onClick={() => {
                                        shell.openExternal("https://twitter.com/MysteriumNet")
                                    }}
                                />
                            </IconButton>
                            <IconButton active={false}>
                                <FontAwesomeIcon
                                    icon={faFacebookSquare}
                                    size="2x"
                                    onClick={() => {
                                        shell.openExternal("https://www.facebook.com/MysteriumNet")
                                    }}
                                />
                            </IconButton>
                        </SocialButtons>
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
