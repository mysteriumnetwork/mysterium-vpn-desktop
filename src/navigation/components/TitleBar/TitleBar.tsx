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
import { remote } from "electron"

import { useStores } from "../../../store"
import { IconMystToken } from "../../../ui-kit/icons/IconMystToken"
import { fmtMoney } from "../../../payment/display"
import { locations } from "../../locations"
import { titleBarSize } from "../../../config"
import { ProtectionStatus } from "../../../location/components/ProtectionStatus/ProtectionStatus"
import { CurrentIP } from "../../../location/components/CurrentIP/CurrentIP"
import { darkBlue, greyBlue1 } from "../../../ui-kit/colors"

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

    color: ${darkBlue};
    background: #fcfcfc;
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
    background: ${(props) => (props.active ? greyBlue1 : "inherit")};
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
export const TitleBar: React.FC = observer(() => {
    const { navigation, router, identity } = useStores()
    // const clickReferrals = () => {
    //     navigation.toggleReferrals()
    //     if (!referralsActive) {
    //         referral.generateToken()
    //     }
    // }
    const balance = fmtMoney(
        {
            amount: identity.identity?.balance ?? 0,
            currency: Currency.MYSTTestToken,
        },
        {
            fractionDigits: 2,
            removeInsignificantZeros: true,
        },
    )
    const isWindows = remote.getGlobal("os") === "win32"
    const isLinux = remote.getGlobal("os") !== "darwin" && !isWindows
    return (
        <Container>
            {/** Sorry, Mike. Re-adding this soon as the referral-available check is implemented.
             /*<NavigationButton onClick={clickReferrals}>
             <NavigationIcon icon={faRetweet} size="1x" />
             <span style={{ marginLeft: 5 }}>Refer a friend</span>
             </NavigationButton>*/}

            <NavigationButton active={navigation.isHomeActive} onClick={() => navigation.goHome()}>
                <FontAwesomeIcon icon={faHome} />
            </NavigationButton>
            <NavigationButton
                active={navigation.isPreferencesActive}
                onClick={() => router.push(locations.preferences)}
            >
                Settings
            </NavigationButton>
            <NavigationButton active={navigation.isHelpActive} onClick={() => router.push(locations.reportIssue)}>
                Help
            </NavigationButton>
            <Location>
                <IP />
                <ProtectionStatus />
            </Location>
            <WalletButton active={navigation.isWalletActive} onClick={() => router.push(locations.wallet)}>
                <Money>
                    <IconMystToken color={navigation.isWalletActive ? "#fff" : greyBlue1} />
                    <span>
                        {balance} {Currency.MYSTTestToken}
                    </span>
                </Money>
            </WalletButton>
            {isWindows && <WindowButtonsWindows />}
            {isLinux && <WindowButtonsLinux />}
        </Container>
    )
})
