/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { shell } from "electron"
import CountDown from "react-countdown"

import { useStores } from "../../../store"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { Heading2, Paragraph, Small } from "../../../ui-kit/typography"
import { brand, brandLight } from "../../../ui-kit/colors"
import { displayUSD } from "../../../payment/display"
import { userEvent } from "../../../analytics/analytics"
import { WalletAction } from "../../../analytics/actions"
import { Anchor } from "../../../ui-kit/components/Anchor"
import { QR } from "../../../ui-kit/components/QR/QR"
import { OrderStatus } from "../../../payment/store"
import { locations } from "../../../navigation/locations"
import { StepProgressBar } from "../../../ui-kit/components/StepProgressBar/StepProgressBar"

import { LogoCoingate } from "./LogoCoingate"

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
    text-align: center;
`

const TitleIcon = styled.div`
    margin-bottom: 15px;
`
const Title = styled(Heading2)`
    margin-bottom: 15px;
`

const TitleDescription = styled(Small)``

const Content = styled(ViewContent)`
    padding: 20px 15px;
`

const FiatEquivalent = styled.div`
    margin-top: auto;
    text-align: center;
    font-size: 11px;
`

const PaymentCountDown = styled(Heading2)`
    margin-bottom: 15px;
`
const PaymentAmount = styled.div`
    background: ${brand};
    color: #fff;
    padding: 5px 10px;
    border-radius: 50px;
    margin-bottom: 30px;
`

const PaymentQR = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
`

const PaymentAddress = styled.div`
    overflow-wrap: anywhere;
    overflow-y: scroll;
    user-select: text;
    opacity: 0.7;
    max-height: 60px;
    border: 1px solid #ffffff99;
    border-radius: 5px;
    padding: 10px;
`

const PaymentExplanation = styled(Paragraph)`
    margin-top: auto;
`

export const TopupWaitingForPayment: React.FC = observer(() => {
    const { payment, router } = useStores()
    const onPayInBrowserClick = () => {
        userEvent(WalletAction.PayInBrowser)
        if (payment.order?.paymentUrl) {
            shell.openExternal(payment.order?.paymentUrl)
        }
    }
    useEffect(() => {
        switch (payment.orderStatus) {
            case OrderStatus.SUCCESS:
                router.push(locations.walletTopupSuccess)
                break
            case OrderStatus.FAILED:
                router.push(locations.walletTopupFailed)
                break
        }
    }, [payment.orderStatus])
    return (
        <ViewContainer>
            <ViewNavBar onBack={() => router.history?.goBack()}>
                <div style={{ width: 375, textAlign: "center" }}>
                    <StepProgressBar step={2} />
                </div>
            </ViewNavBar>
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <TitleIcon>
                            <IconWallet color={brandLight} />
                        </TitleIcon>
                        <Title>Waiting for payment</Title>
                        <TitleDescription>Scan QR code or use a payment link below</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <Anchor onClick={onPayInBrowserClick}>Pay in browser instead?</Anchor>
                        <Paragraph style={{ marginBottom: 15, marginTop: "auto" }}>
                            Payment is handled by our payment partner Coingate.
                        </Paragraph>
                        <LogoCoingate />
                        <FiatEquivalent>
                            {payment.appFiatCurrency} equivalent ≈{" "}
                            {displayUSD(payment.fiatEquivalent(payment.topupAmount ?? 0))}
                        </FiatEquivalent>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <PaymentCountDown>
                        <CountDown
                            date={payment.orderExpiresAt}
                            renderer={(props) => (
                                <div>
                                    {props.minutes.toString().padStart(2, "0")}:
                                    {props.seconds.toString().padStart(2, "0")}
                                </div>
                            )}
                        />
                    </PaymentCountDown>
                    <PaymentAmount>
                        <Heading2>
                            {payment.order?.payAmount} {payment.order?.payCurrency}
                        </Heading2>
                        {/*<Heading2>0.000245 BTC</Heading2>*/}
                    </PaymentAmount>
                    <PaymentQR>
                        <QR height={160} text={payment.order?.paymentAddress} />
                    </PaymentQR>
                    <PaymentAddress>
                        {/*lnbc105160n1pswwncgpp5pk2pvvwulw2a7fv30matjqttdvypq7jh4ggqf8hu68yqld4zygaqdp9gdhkjmj8v96x2gz0wfjx2u3qyvursdpkxqungcqzpgxqrp9wsp58rygp0pxd2cljmwmn3lqfent0epz77muztfedhezg7lphsluzc4q9qyyssq4t8r67g9xh80qg2nrgxrvx45frjdque327tc8jpznumy73gjdhw5spfs4y8296zc45mpldhd2kr8xkg5eusjj6v2dms3n44p6nwu42gqqm7hqm*/}
                        {payment.order?.paymentAddress}
                    </PaymentAddress>
                    <PaymentExplanation>Send the indicated amount to the address above.</PaymentExplanation>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
