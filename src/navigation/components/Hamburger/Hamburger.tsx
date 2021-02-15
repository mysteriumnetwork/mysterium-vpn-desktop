/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookSquare, faGithub, faMedium, faReddit, faTwitter } from "@fortawesome/free-brands-svg-icons"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { remote, shell } from "electron"

import { useStores } from "../../../store"
import { textSmall } from "../../../ui-kit/typography"
import { brandDarker } from "../../../ui-kit/colors"
import { locations } from "../../locations"
import { userEvent } from "../../../analytics/analytics"
import { OtherAction } from "../../../analytics/actions"

type Div = React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>

export interface HamburgerProps {
    buttonRef: React.RefObject<HTMLDivElement>
}

export const Hamburger: React.FC<HamburgerProps> = observer(({ buttonRef: buttonRef }) => {
    const { navigation, router } = useStores()
    const dropdownMenuRef = useRef<HTMLDivElement>(null)
    const handleClickOutside: EventListener = (event) => {
        const isOutsideClick =
            !dropdownMenuRef.current?.contains(event.target as Node) &&
            !buttonRef.current?.contains(event.target as Node)
        if (isOutsideClick) {
            navigation.showMenu(false)
        }
    }
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
        return () => {
            document.removeEventListener("click", handleClickOutside, true)
        }
    })
    const quit = () => {
        userEvent(OtherAction.MenuQuit)
        remote.app.quit()
    }
    if (!navigation.menu) {
        return <></>
    }
    return (
        <DropdownMenu ref={dropdownMenuRef}>
            <MenuItem
                onClick={() => {
                    navigation.showMenu(false)
                    router.push(locations.preferences)
                }}
            >
                Preferences
            </MenuItem>
            <Separator />
            <MenuItem
                onClick={() => {
                    navigation.showMenu(false)
                    router.push(locations.reportIssue)
                }}
            >
                Bug report
            </MenuItem>
            <MenuItem
                onClick={() => {
                    userEvent(OtherAction.GetHelp)
                    navigation.showMenu(false)
                    navigation.openChat()
                }}
            >
                Get help
            </MenuItem>
            <Separator />
            <MenuItem
                onClick={() => {
                    userEvent(OtherAction.AboutApp)
                    navigation.showMenu(false)
                    remote.app.showAboutPanel()
                }}
            >
                About the app
            </MenuItem>
            <SocialMenuItem>
                <FollowUs>Follow us</FollowUs>
                <SocialLinks>
                    <SocialIcon
                        icon={faFacebookSquare}
                        onClick={() => {
                            userEvent(OtherAction.SocialFacebook)
                            navigation.showMenu(false)
                            shell.openExternal("https://www.facebook.com/MysteriumNet")
                        }}
                    />
                    <SocialIcon
                        icon={faTwitter}
                        onClick={() => {
                            userEvent(OtherAction.SocialTwitter)
                            navigation.showMenu(false)
                            shell.openExternal("https://twitter.com/MysteriumNet")
                        }}
                    />
                    <SocialIcon
                        icon={faMedium}
                        onClick={() => {
                            userEvent(OtherAction.SocialMedium)
                            navigation.showMenu(false)
                            shell.openExternal("https://medium.com/mysterium-network")
                        }}
                    />
                    <SocialIcon
                        icon={faReddit}
                        onClick={() => {
                            userEvent(OtherAction.SocialReddit)
                            navigation.showMenu(false)
                            shell.openExternal("https://www.reddit.com/r/MysteriumNetwork/")
                        }}
                    />
                    <SocialIcon
                        icon={faGithub}
                        onClick={() => {
                            userEvent(OtherAction.SocialGithub)
                            navigation.showMenu(false)
                            shell.openExternal("https://github.com/mysteriumnetwork")
                        }}
                    />
                </SocialLinks>
            </SocialMenuItem>
            <Separator />
            <MenuItem onClick={quit}>Quit</MenuItem>
        </DropdownMenu>
    )
})

const DropdownMenu = styled.div`
    position: absolute;
    top: 40px;
    left: 400px;
    width: 236px;
    padding: 4px 0;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.3);
    z-index: 5;
    overflow: hidden;
    color: #404040;
` as Div

const SocialMenuItem = styled.div`
    padding: 12px 16px;
`

const FollowUs = styled.div`
    ${textSmall};
    margin-bottom: 4px;
    color: #808080;
`

const SocialLinks = styled.div`
    display: flex;
    justify-content: space-between;
`

const SocialIcon = styled(FontAwesomeIcon)`
    font-size: 1.7rem;
    &:hover {
        color: ${brandDarker};
    }
`

const MenuItem = styled.div`
    min-height: 32px;
    line-height: 32px;
    padding: 0 16px;
    &:hover {
        background: linear-gradient(180deg, #873a72 0%, #673a72 100%);
        color: #fff;
    }
` as Div

const Separator = styled.div`
    height: 1px;
    margin: 4px 0;
    background: #e6e6e6;
`
