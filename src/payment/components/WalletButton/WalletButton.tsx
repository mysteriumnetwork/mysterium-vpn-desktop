/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency, displayMoney } from "mysterium-vpn-js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"

import { useStores } from "../../../store"
import { NavToggle } from "../../../ui-kit/components/Toggle/NavToggle"
import { brandDarker } from "../../../ui-kit/colors"
import { MystToken } from "../MystToken/MystToken"

const MoneyToggle = styled(NavToggle)`
    padding: 0;
`

const Content = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span:first-child {
        margin-right: auto;
    }
`

const Icon = styled.div`
    height: 100%;
    padding: 0 8px;
    line-height: 24px;
`

interface MoneyProps {
    active: boolean
}

const Money = styled.div<MoneyProps>`
    padding: 0 8px;
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

    const balance = displayMoney(
        {
            amount: identity.identity?.balance ?? 0,
            currency: Currency.MYSTTestToken,
        },
        {
            fractionDigits: 3,
            removeInsignificantZeros: false,
        },
    )
    const active = navigation.wallet
    const onClick = (): void => {
        navigation.toggleWallet()
    }
    return (
        <MoneyToggle small active={active} onClick={onClick}>
            <Content>
                <Icon>
                    <FontAwesomeIcon icon={faWallet} color={active ? "#fff" : brandDarker} />
                </Icon>
                <Money active={active}>
                    <span>{balance}</span>
                    <MystToken light={active} />
                </Money>
            </Content>
        </MoneyToggle>
    )
})
