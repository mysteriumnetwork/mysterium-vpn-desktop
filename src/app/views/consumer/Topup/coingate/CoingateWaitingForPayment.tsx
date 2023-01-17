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
import { useNavigate } from "react-router-dom"

import { useStores } from "../../../../store"
import { ViewContainer } from "../../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../../ui-kit/icons/IconWallet"
import { Heading2, Paragraph, Small } from "../../../../ui-kit/typography"
import { brand, brandLight } from "../../../../ui-kit/colors"
import { Anchor } from "../../../../ui-kit/components/Anchor"
import { QR } from "../../../../ui-kit/components/QR/QR"
import { OrderStatus } from "../../../../payment/store"
import { topupSteps } from "../../../../navigation/locations"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { OrderBreakdown } from "../common/OrderBreakdown"

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

const PaymentCountDown = styled(Heading2)`
    height: 21px;
    margin-bottom: 15px;
`
const PaymentAmount = styled.div`
    height: 21px;
    background: ${brand};
    color: #fff;
    padding: 5px 10px;
    border-radius: 50px;
    margin-bottom: 15px;
    user-select: text;
`

const PaymentQR = styled.div`
    background: #fff;
    padding: 5px;
    margin-bottom: 15px;
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

const PaymentWarning = styled(Small)`
    margin: 5px 0;
    max-height: 60px;
    overflow-y: scroll;
    text-overflow: ellipsis;
`

const PaymentExplanation = styled(Paragraph)`
    margin-top: auto;
`

const LogoContainer = styled.div`
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`

export const CoingateWaitingForPayment: React.FC = observer(() => {
    const { payment } = useStores()
    const navigate = useNavigate()
    const onPayInBrowserClick = () => {
        if (payment.order?.publicGatewayData?.paymentUrl) {
            shell.openExternal(payment.order?.publicGatewayData.paymentUrl)
        }
    }
    useEffect(() => {
        switch (payment.orderStatus) {
            case OrderStatus.SUCCESS:
                navigate("../" + topupSteps.success)
                break
            case OrderStatus.FAILED:
                navigate("../" + topupSteps.failed)
                break
        }
    }, [payment.orderStatus])
    return (
        <ViewContainer>
            <ViewNavBar onBack={() => navigate(-1)}>
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
                        <OrderBreakdown />
                        <Small style={{ margin: "auto 0" }}>Payment is handled by our payment partner Coingate.</Small>
                        <LogoContainer>
                            <LogoCoingate />
                        </LogoContainer>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <PaymentCountDown>
                        {payment.orderExpiresAt ? (
                            <CountDown
                                date={payment.orderExpiresAt}
                                renderer={(props) => (
                                    <div>
                                        {props.minutes.toString().padStart(2, "0")}:
                                        {props.seconds.toString().padStart(2, "0")}
                                    </div>
                                )}
                            />
                        ) : (
                            <span>— : —</span>
                        )}
                    </PaymentCountDown>
                    <PaymentAmount>
                        <Heading2>
                            {payment.order?.payAmount} {payment.order?.payCurrency}
                        </Heading2>
                    </PaymentAmount>
                    <PaymentQR>
                        <QR size={168} text={payment.order?.publicGatewayData?.paymentAddress} />
                    </PaymentQR>
                    <PaymentAddress>{payment.order?.publicGatewayData?.paymentAddress}</PaymentAddress>
                    <PaymentWarning>
                        This address is for {payment.order?.payCurrency ?? "—"} deposits only. Do not send any other
                        cryptocurrency or {payment.order?.payCurrency ?? "—"} from any other chains, such as Binance
                        Chain (BEP-2/BSC) or your deposit will be lost.
                    </PaymentWarning>
                    <PaymentExplanation>Send the indicated amount to the address above.</PaymentExplanation>
                    <Anchor onClick={onPayInBrowserClick}>Pay in browser instead?</Anchor>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
