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

import { useStores } from "../../../store"
import { IconMystToken } from "../../../ui-kit/icons/IconMystToken"
import { fmtMoney } from "../../../payment/display"
import { locations } from "../../locations"
import { titleBarSize } from "../../../config"
import { ProtectionStatus } from "../../../location/components/ProtectionStatus/ProtectionStatus"
import { CurrentIP } from "../../../location/components/CurrentIP/CurrentIP"

const Container = styled.div`
    box-sizing: border-box;
    height: ${titleBarSize.height}px;
    padding: 8px 16px;
    .darwin & {
        padding-left: 80px;
    }
    color: #3c3857;
    background: #fcfcfc;
    display: flex;
    align-items: center;

    user-select: none;
    -webkit-app-region: drag;
`

const NavigationButton = styled.div`
    -webkit-app-region: no-drag;
    height: 20px;
    line-height: 12px;
    padding: 0 16px;
    border-radius: 18px;
    &:hover {
        background: #aeaedb33;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        display: block;
    }
`

const WalletButton = styled(NavigationButton)`
    background: #aeaedb33;
    box-sizing: border-box;
    min-width: 114px;
    margin-left: auto;
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
    return (
        <Container>
            {/** Sorry, Mike. Re-adding this soon as the referral-available check is implemented.
             /*<NavigationButton onClick={clickReferrals}>
             <NavigationIcon icon={faRetweet} size="1x" />
             <span style={{ marginLeft: 5 }}>Refer a friend</span>
             </NavigationButton>*/}

            <NavigationButton onClick={() => navigation.goHome()}>
                <FontAwesomeIcon icon={faHome} />
            </NavigationButton>
            <NavigationButton onClick={() => router.push(locations.preferences)}>Settings</NavigationButton>
            <NavigationButton onClick={() => router.push(locations.reportIssue)}>Help</NavigationButton>
            <Location>
                <IP />
                <ProtectionStatus />
            </Location>
            <WalletButton onClick={() => router.push(locations.wallet)}>
                <Money>
                    <IconMystToken />
                    <span>
                        {balance} {Currency.MYSTTestToken}
                    </span>
                </Money>
            </WalletButton>
        </Container>
    )
})
