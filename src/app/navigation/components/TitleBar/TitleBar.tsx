/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { Currency } from "mysterium-vpn-js"
import { observer } from "mobx-react-lite"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useLocation, useNavigate } from "react-router-dom"

import { useStores } from "../../../store"
import { IconMystToken } from "../../../ui-kit/icons/IconMystToken"
import { locations } from "../../locations"
import { titleBarSize } from "../../../../config"
import { ProtectionStatus } from "../../../location/components/ProtectionStatus/ProtectionStatus"
import { CurrentIP } from "../../../location/components/CurrentIP/CurrentIP"
import { greyBlue1, greyBlue2, lightBlue } from "../../../ui-kit/colors"
import { displayTokens2 } from "../../../payment/display"

import { WindowButtonsWindows } from "./WindowButtonsWindows"
import { WindowButtonsLinux } from "./WindowButtonsLinux"

export const Container = styled.div`
    box-sizing: border-box;
    height: ${titleBarSize.height}px;
    flex-shrink: 0;

    padding: 0 15px;
    .win32 & {
        padding: 0;
    }
    .darwin & {
        padding-left: 80px;
    }

    color: ${lightBlue};
    background: #0c0c0c;
    display: flex;
    align-items: center;

    user-select: none;
    -webkit-app-region: drag;
`

const NavigationButton = styled.div<{ active: boolean }>`
    -webkit-app-region: no-drag;

    height: 28px;
    border-radius: 4px;
    margin-right: 8px;
    .win32 & {
        height: 100%;
        border-radius: 0;
        margin-right: 0;
    }
    .darwin & {
        height: 20px;
        border-radius: 18px;
    }

    line-height: 12px;
    padding: 0 16px;

    &:hover {
        background: ${(props) => (props.active ? greyBlue1 : "#aeaedb33")};
        color: ${(props) => (props.active ? "#fff" : "inherit")};
    }
    background: ${(props) => (props.active ? greyBlue2 : "inherit")};
    color: ${(props) => (props.active ? "#fff" : "inherit")};

    display: flex;
    justify-content: center;
    align-items: center;
`

const WalletButton = styled(NavigationButton)`
    box-sizing: border-box;
    min-width: 114px;
    margin: 0 16px 0 auto;
    .darwin & {
        margin-right: 0;
    }
    overflow: hidden;
    white-space: nowrap;
`

const Location = styled.div`
    margin: 0 auto;
    display: flex;
    flex: 0;
`

const IP = styled(CurrentIP)`
    opacity: 0.5;
`

const Money = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
        padding-left: 6px;
    }
`
export const TitleBar: React.FC = observer(function TitleBar() {
    const { navigation, identity, isWindows, isLinux } = useStores()
    const navigate = useNavigate()
    const location = useLocation()
    const isHomeActive = location.pathname.startsWith(locations.consumer)
    const isSettingsActive = location.pathname.startsWith(locations.settings)
    const isHelpActive = location.pathname.startsWith(locations.help)
    const isWalletActive = location.pathname.startsWith(locations.wallet)
    return (
        <Container>
            <NavigationButton active={isHomeActive} onClick={() => !isHomeActive && navigation.goHome()}>
                <FontAwesomeIcon icon={faHome} />
            </NavigationButton>
            <NavigationButton
                active={isSettingsActive}
                onClick={() => !isSettingsActive && navigate(locations.settings)}
            >
                Settings
            </NavigationButton>
            <NavigationButton active={isHelpActive} onClick={() => !isHelpActive && navigate(locations.help)}>
                Help
            </NavigationButton>
            <Location>
                <IP />
                <ProtectionStatus />
            </Location>
            <WalletButton active={isWalletActive} onClick={() => !isWalletActive && navigate(locations.wallet)}>
                <Money>
                    <IconMystToken color={isWalletActive ? "#fff" : greyBlue1} />
                    <span>
                        {displayTokens2(identity.identity?.balanceTokens)} {Currency.MYST}
                    </span>
                </Money>
            </WalletButton>
            {isWindows && <WindowButtonsWindows />}
            {isLinux && <WindowButtonsLinux />}
        </Container>
    )
})
