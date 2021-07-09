/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { userEvent } from "../../../analytics/analytics"
import { WalletAction } from "../../../analytics/actions"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { Heading2, Small } from "../../../ui-kit/typography"
import { brandLight, lightBlue } from "../../../ui-kit/colors"
import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"
import { displayUSD } from "../../../payment/display"
import { locations } from "../../../navigation/locations"

const SideTop = styled.div`
    box-sizing: border-box;
    height: 136px;
    padding: 20px 15px;
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

const TitleDescription = styled(Small)``

const AmountSelect = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
`

const AmountToggle = styled(Toggle)`
    width: 85px;
    height: 63px;
`

const Amount = styled(Heading2)`
    margin-bottom: 5px;
`
const Currency = styled(Small)`
    opacity: 0.7;
`

const FiatEquivalent = styled.div`
    margin-top: auto;
    text-align: center;
    font-size: 11px;
`

export const TopupSelectAmount: React.FC = observer(() => {
    const { payment, router } = useStores()

    const isOptionActive = (amt: number) => {
        return payment.topupAmount == amt
    }
    const selectOption = (amt: number) => () => {
        userEvent(WalletAction.ChangeTopupAmount, String(amt))
        payment.setTopupAmount(amt)
    }
    const handleNextClick = () => {
        router.push(locations.walletTopupSelectCurrency)
    }
    const currency = "MYSTT"
    return (
        <ViewContainer>
            <ViewNavBar />
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconWallet color={brandLight} />
                        <Title>Top up your account</Title>
                        <TitleDescription>
                            Select how many {currency}s you would like to add to your account
                        </TitleDescription>
                    </SideTop>
                    <SideBot>
                        <AmountSelect>
                            {payment.orderOptions.map((opt) => (
                                <AmountToggle
                                    key={opt}
                                    active={isOptionActive(opt)}
                                    onClick={selectOption(opt)}
                                    inactiveColor={lightBlue}
                                    height="63px"
                                    justify="center"
                                >
                                    <div style={{ textAlign: "center" }}>
                                        <Amount>{opt}</Amount>
                                        <Currency>{currency}</Currency>
                                    </div>
                                </AmountToggle>
                            ))}
                        </AmountSelect>
                        <FiatEquivalent>
                            {payment.appFiatCurrency} equivalent ≈{" "}
                            {displayUSD(payment.fiatEquivalent(payment.topupAmount ?? 0))}
                        </FiatEquivalent>
                        <BrandButton
                            style={{ marginTop: "15px" }}
                            onClick={handleNextClick}
                            disabled={!payment.topupAmount}
                        >
                            Next
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <ViewContent>{/* TODO: entertainment estimates here */}</ViewContent>
            </ViewSplit>
        </ViewContainer>
    )
})
