/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useRef } from "react"
import styled from "styled-components"
import { Currency } from "mysterium-vpn-js"
import { faEllipsisV, faHome, faRetweet, faSlidersH } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { observer } from "mobx-react-lite"

import { Hamburger } from "../Hamburger/Hamburger"
import { useStores } from "../../../store"
import { brandDarker } from "../../../ui-kit/colors"
import { IconMystToken } from "../../../ui-kit/icons/IconMystToken"
import { fmtMoney } from "../../../payment/display"

const Container = styled.div`
    box-sizing: border-box;
    height: 53px;
    padding: 8px 16px;
    .darwin & {
        padding-left: 72px;
    }
    color: #565454;
    background: #fbf4f5;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d9d9d9;

    -webkit-user-select: none;
    -webkit-app-region: drag;
`

const NavigationButton = styled.div`
    -webkit-app-region: no-drag;
    height: 30px;
    line-height: 30px;
    padding: 0 16px;
    border-radius: 6px;
    &:hover {
        background: #eee8e8;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        display: block;
    }
`

const NavigationIcon = styled(FontAwesomeIcon)`
    font-size: 16px;
`

const Money = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${brandDarker};
    span {
        padding-right: 4px;
    }
`

export const NavBar: React.FC = observer(() => {
    const { navigation, referral, identity } = useStores()
    const { referrals: referralsActive, menu: menuActive } = navigation
    const clickHome = () => {
        navigation.hideModals()
    }
    const clickFilters = () => {
        navigation.toggleFilters()
    }
    const clickReferrals = () => {
        navigation.toggleReferrals()
        if (!referralsActive) {
            referral.generateToken()
        }
    }
    const clickWallet = () => {
        navigation.toggleWallet()
    }
    const balance = fmtMoney(
        {
            amount: identity.identity?.balance ?? 0,
            currency: Currency.MYSTTestToken,
        },
        {
            fractionDigits: 3,
            removeInsignificantZeros: false,
        },
    )
    const hamburgerRef = useRef<HTMLDivElement>(null)
    const clickHamburger = () => {
        navigation.showMenu(!menuActive)
    }
    return (
        <Container>
            <NavigationButton onClick={clickHome}>
                <NavigationIcon icon={faHome} size="1x" />
            </NavigationButton>
            <NavigationButton onClick={clickFilters}>
                <NavigationIcon icon={faSlidersH} size="1x" />
            </NavigationButton>
            <NavigationButton onClick={clickReferrals}>
                <NavigationIcon icon={faRetweet} size="1x" />
                <span style={{ marginLeft: 5 }}>Refer a friend</span>
            </NavigationButton>
            <div style={{ marginLeft: "auto" }}>
                <NavigationButton onClick={clickWallet}>
                    <Money>
                        <span>{balance}</span>
                        <IconMystToken />
                    </Money>
                </NavigationButton>
            </div>
            <NavigationButton ref={hamburgerRef} onClick={clickHamburger}>
                <NavigationIcon icon={faEllipsisV} size="1x" />
                <Hamburger buttonRef={hamburgerRef} />
            </NavigationButton>
        </Container>
    )
})
