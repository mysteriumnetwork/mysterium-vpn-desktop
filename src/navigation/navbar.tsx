/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { useLocation } from "react-router-dom"

import { WalletButton } from "../payment/comp/wallet-button"
import { useStores } from "../store"
import { NavToggle } from "../ui-kit/toggle/nav-toggle"

import { locations } from "./locations"

const Container = styled.div`
    box-sizing: border-box;
    height: 40px;
    padding: 8px 16px;
    background: linear-gradient(180deg, #d6d6d6 0%, #cccccc 97%, #bababa 100%);
    display: flex;
    justify-content: space-between;
`

export const NavBar: React.FC = observer(() => {
    const { navigation } = useStores()
    const location = useLocation()
    const consumerModeActive = location.pathname.startsWith(locations.consumer)
    const consumerModeOnClick = (): void => {
        if (!consumerModeActive) {
            navigation.navigateTo(locations.consumer)
        }
    }
    return (
        <Container>
            <div>
                <NavToggle small active={consumerModeActive} onClick={consumerModeOnClick}>
                    Connect to VPN
                </NavToggle>
            </div>
            <div>
                <WalletButton />
            </div>
        </Container>
    )
})
