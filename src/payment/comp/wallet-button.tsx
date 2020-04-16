/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { useLocation } from "react-router-dom"
import styled from "styled-components"

import { useStores } from "../../store"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { brandDarker } from "../../ui-kit/colors"

import { Myst } from "./myst"

export const mystDisplay = (m?: number): string => {
    if (!m) {
        return "0"
    }
    return (m / 100000000).toFixed(3)
}

const Content = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span:first-child {
        margin-right: auto;
    }
`

interface MoneyProps {
    active: boolean
}

const Money = styled.div<MoneyProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${(props: MoneyProps): string => (props.active ? "#fff" : brandDarker)};
    span {
        padding-right: 4px;
    }
`

export const WalletButton: React.FC = observer(() => {
    const { identity, navigation } = useStores()
    const location = useLocation()

    const balance = mystDisplay(identity.identity?.balance)
    const active = location.pathname == "/wallet"
    return (
        <Toggle small active={active} onClick={(): void => navigation.navigateTo("/wallet")}>
            <Content>
                <span>Wallet</span>
                <Money active={active}>
                    <span>{balance}</span>
                    <Myst light={active} />
                </Money>
            </Content>
        </Toggle>
    )
})
