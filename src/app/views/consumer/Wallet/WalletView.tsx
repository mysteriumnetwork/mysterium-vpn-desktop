/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency, DECIMAL_PART } from "mysterium-vpn-js"
import { Redirect, Route, Switch } from "react-router-dom"

import { useStores } from "../../../store"
import { Heading2, Paragraph } from "../../../ui-kit/typography"
import { displayUSD, fmtMoney } from "../../../payment/display"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { brandLight } from "../../../ui-kit/colors"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { locations } from "../../../navigation/locations"

import { WalletIdentity } from "./WalletIdentity"

const SideTop = styled.div`
    height: 156px;
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
    height: 330px;
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Balance = styled(Heading2)`
    margin-top: 15px;
`

const BalanceCurrency = styled(Paragraph)`
    color: ${brandLight};
`

const BalanceFiatEquivalent = styled.div`
    margin-top: 16px;
    font-size: 11px;
`

const Content = styled(ViewContent)`
    background: none;
`

export const WalletView: React.FC = observer(() => {
    const { identity, payment, router } = useStores()
    const balance = identity.identity?.balance ?? 0
    const balanceDisplay = fmtMoney(
        {
            amount: balance,
            currency: Currency.MYSTTestToken,
        },
        {
            fractionDigits: 4,
            removeInsignificantZeros: false,
        },
    )
    const handleTopupClick = () => {
        router.push(locations.walletTopup)
    }
    return (
        <ViewContainer>
            <ViewNavBar />

            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconWallet color={brandLight} />
                        <Balance>{balanceDisplay}</Balance>
                        <BalanceCurrency>{payment.appCurrency}</BalanceCurrency>
                        <BalanceFiatEquivalent>
                            {payment.appFiatCurrency} equivalent ≈{" "}
                            {displayUSD(payment.fiatEquivalent(balance / DECIMAL_PART))}
                        </BalanceFiatEquivalent>
                    </SideTop>
                    <SideBot>
                        <BrandButton style={{ marginTop: "auto" }} onClick={handleTopupClick}>
                            Top up
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <Switch>
                        <Route exact path={locations.walletIdentity.path}>
                            <WalletIdentity />
                        </Route>
                        <Redirect to={locations.walletIdentity.path} />
                    </Switch>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
