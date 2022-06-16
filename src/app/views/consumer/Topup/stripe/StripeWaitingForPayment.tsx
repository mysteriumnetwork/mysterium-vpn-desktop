/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
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
import { OrderStatus } from "../../../../payment/store"
import { topupSteps } from "../../../../navigation/locations"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { Spinner } from "../../../../ui-kit/components/Spinner/Spinner"
import { OrderBreakdown } from "../common/OrderBreakdown"

import { LogoStripe } from "./LogoStripe"

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

const PaymentAmount = styled.div`
    background: ${brand};
    color: #fff;
    padding: 5px 10px;
    border-radius: 50px;
    margin-bottom: 15px;
    user-select: text;
`

const Loading = styled(Spinner)`
    margin: auto;
`

const LogoContainer = styled.div`
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`

const PaymentExplanation = styled(Paragraph)`
    margin-bottom: auto;
`

export const StripeWaitingForPayment: React.FC = observer(() => {
    const { payment } = useStores()
    const navigate = useNavigate()
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
                        <TitleDescription>Please complete the payment in the popup window.</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <OrderBreakdown />
                        <Small style={{ margin: "auto 0" }}>
                            Payment is handled by Stripe.
                            <br />
                            We do not store any card details.
                        </Small>
                        <LogoContainer>
                            <LogoStripe />
                        </LogoContainer>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <PaymentAmount>
                        <Heading2>
                            {payment.order?.payAmount} {payment.order?.payCurrency}
                        </Heading2>
                    </PaymentAmount>
                    <Loading />
                    <PaymentExplanation>Waiting for payment...</PaymentExplanation>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
