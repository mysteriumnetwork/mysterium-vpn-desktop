/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import CountDown from "react-countdown"
import useInterval from "@use-it/interval"
import { useNavigate } from "react-router-dom"
import { reaction } from "mobx"
import BigNumber from "bignumber.js"

import { useStores } from "../../../../store"
import { ViewContainer } from "../../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../../ui-kit/icons/IconWallet"
import { Heading2, Paragraph, Small } from "../../../../ui-kit/typography"
import { brand, brandLight } from "../../../../ui-kit/colors"
import { QR } from "../../../../ui-kit/components/QR/QR"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { Spinner } from "../../../../ui-kit/components/Spinner/Spinner"
import { topupSteps } from "../../../../navigation/locations"

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
    margin-bottom: 15px;
`
const PaymentAmount = styled.div`
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

const PaymentExplanation = styled(Paragraph)`
    margin-top: auto;
`

const Loading = styled(Spinner)`
    margin: auto;
`

export const MystPolygonWaitingForPayment: React.FC = observer(() => {
    const { payment, identity } = useStores()
    const navigate = useNavigate()
    reaction(
        () => identity.identity?.balanceTokens,
        (cur, prev) => {
            if (new BigNumber(cur?.wei ?? 0).isGreaterThan(new BigNumber(prev?.wei ?? 0))) {
                navigate("../" + topupSteps.success)
            }
        },
    )
    useInterval(() => {
        payment.refreshBalance()
    }, 30_000)
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
                        <TitleDescription>
                            Deposit MYST by sending them directly to your payment channel
                        </TitleDescription>
                    </SideTop>
                    <SideBot>
                        <Loading />
                        <Small style={{ margin: "auto 0" }}>
                            Balance is being refreshed automatically while this screen is open
                        </Small>
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
                    </PaymentAmount>
                    <PaymentQR>
                        <QR size={192} text={identity.identity?.channelAddress} />
                    </PaymentQR>
                    <PaymentAddress>{identity.identity?.channelAddress}</PaymentAddress>
                    <PaymentExplanation>Send Polygon MYST to the address above.</PaymentExplanation>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
