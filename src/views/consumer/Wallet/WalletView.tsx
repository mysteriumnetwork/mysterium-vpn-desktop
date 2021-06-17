/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency, DECIMAL_PART } from "mysterium-vpn-js"

import { useStores } from "../../../store"
import { Heading1, Paragraph } from "../../../ui-kit/typography"
import { displayUSD, fmtMoney } from "../../../payment/display"
import { Modal } from "../../../ui-kit/components/Modal/Modal"
import { TopupView } from "../Topup/TopupView"
import { ReceiveTokens } from "../ReceiveTokens/ReceiveTokens"
import { userEvent } from "../../../analytics/analytics"
import { WalletAction } from "../../../analytics/actions"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { brandLight } from "../../../ui-kit/colors"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { IconIdentity } from "../../../ui-kit/icons/IconIdentity"
import { TextInput } from "../../../ui-kit/form-components/TextInput"

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

const Balance = styled(Heading1)`
    margin-top: 17px;
`

const BalanceCurrency = styled(Paragraph)`
    color: ${brandLight};
`

const BalanceFiatEquivalent = styled.div`
    margin-top: 16px;
    font-size: 11px;
`

const Content = styled(ViewContent)`
    color: #fff;
    padding: 20px 26px;
`

const SectionTitle = styled(Paragraph)`
    margin-top: 13px;
    height: 28px;
`
const Explanation = styled.div`
    font-size: 12px;
    line-height: 14px;
    opacity: 0.5;
    margin-bottom: 15px;
`

export const WalletView: React.FC = observer(() => {
    const { identity, payment } = useStores()
    const [topupModal, setTopupModal] = useState(false)
    const [receiveTokensModal, setReceiveTokensModal] = useState(false)
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
    const openTopupModal = () => {
        userEvent(WalletAction.TopupModalOpen)
        setTopupModal(true)
    }
    const closeTopupModal = () => {
        userEvent(WalletAction.TopupModalClose)
        setTopupModal(false)
        payment.clearOrder()
    }
    // const openReceiveTokensModal = () => {
    //     userEvent(WalletAction.ReceiveTokensOpen)
    //     setReceiveTokensModal(true)
    // }
    const closeReceiveTokensModal = () => {
        userEvent(WalletAction.ReceiveTokensClose)
        setReceiveTokensModal(false)
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
                        <BrandButton style={{ marginTop: "auto" }} onClick={openTopupModal}>
                            Top up
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <IconIdentity color={brandLight} />
                    <SectionTitle>Identity: {identity.identity?.registrationStatus}</SectionTitle>
                    <Explanation>
                        Identity is your Mysterium internal user ID. Never send ether or any kind of ERC20 tokens there.
                    </Explanation>
                    <TextInput disabled value={identity.identity?.id} />
                </Content>
            </ViewSplit>

            <Modal title="Topup" visible={topupModal} onClose={closeTopupModal}>
                <TopupView />
            </Modal>
            <Modal title="Receive MYSTT" visible={receiveTokensModal} onClose={closeReceiveTokensModal}>
                <ReceiveTokens />
            </Modal>
        </ViewContainer>
    )
})
