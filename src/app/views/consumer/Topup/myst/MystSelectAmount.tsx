/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { EntertainmentEstimateResponse } from "mysterium-vpn-js"
import { useNavigate } from "react-router-dom"

import { useStores } from "../../../../store"
import { BrandButton } from "../../../../ui-kit/components/Button/BrandButton"
import { ViewContainer } from "../../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../../ui-kit/icons/IconWallet"
import { Heading1, Heading2, Paragraph, Small } from "../../../../ui-kit/typography"
import { brandLight, lightBlue } from "../../../../ui-kit/colors"
import { Toggle } from "../../../../ui-kit/components/Toggle/Toggle"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { IconPlay } from "../../../../ui-kit/icons/IconPlay"
import { IconMusic } from "../../../../ui-kit/icons/IconMusic"
import { IconCloudDownload } from "../../../../ui-kit/icons/IconCloudDownload"
import { IconDocument } from "../../../../ui-kit/icons/IconDocument"
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

const Content = styled(ViewContent)`
    background: none;
`

const EntertainmentBlocks = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
`

const EntertainmentBlock = styled.div`
    width: 179px;
    height: 235px;
    background: #ffffff12;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 10px;
`

const BlockIcon = styled.div`
    margin: 5px auto 5px;
    font-size: 20px;
    color: ${brandLight};
`

const BlockMetric = styled(Heading1)``

const EntertainmentExplanation = styled(Paragraph)`
    margin: 5px auto;
    opacity: 0.7;
`

export const MystSelectAmount: React.FC = observer(() => {
    const { payment } = useStores()
    const navigate = useNavigate()
    const isOptionActive = (amt: number) => {
        return payment.topUpAmountUSD == amt
    }
    const selectOption = (amt: number) => () => {
        payment.setTopupAmountUSD(amt)
    }
    const [estimates, setEstimates] = useState<EntertainmentEstimateResponse | undefined>(undefined)
    useEffect(() => {
        if (payment.topUpAmountUSD) {
            payment.estimateEntertainment({ USD: payment.topUpAmountUSD }).then((res) => setEstimates(res))
        }
    }, [payment.topUpAmountUSD])
    const handleNextClick = async () => {
        navigate("../" + topupSteps.coingatePaymentOptions)
    }
    return (
        <ViewContainer>
            <ViewNavBar onBack={() => navigate(-1)}>
                <div style={{ width: 375, textAlign: "center" }}>
                    <StepProgressBar step={1} />
                </div>
            </ViewNavBar>
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconWallet color={brandLight} />
                        <Title>Top up your account</Title>
                        <TitleDescription>Select the desired amount in {payment.appFiatCurrency}</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <AmountSelect>
                            {payment.orderOptions.map((opt: number) => (
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
                                        <Currency>{payment.appFiatCurrency}</Currency>
                                    </div>
                                </AmountToggle>
                            ))}
                        </AmountSelect>
                        <BrandButton
                            style={{ marginTop: "auto" }}
                            onClick={handleNextClick}
                            disabled={!payment.topUpAmountUSD}
                        >
                            Next
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    {!!estimates && (
                        <>
                            <EntertainmentBlocks>
                                <EntertainmentBlock>
                                    <BlockIcon>
                                        <IconPlay color={brandLight} />
                                    </BlockIcon>
                                    <BlockMetric>{estimates.videoMinutes}h</BlockMetric>
                                    <EntertainmentExplanation>Online video</EntertainmentExplanation>
                                </EntertainmentBlock>
                                <EntertainmentBlock>
                                    <BlockIcon>
                                        <IconMusic color={brandLight} />
                                    </BlockIcon>
                                    <BlockMetric>{estimates.musicMinutes}h</BlockMetric>
                                    <EntertainmentExplanation>Online music</EntertainmentExplanation>
                                </EntertainmentBlock>
                                <EntertainmentBlock>
                                    <BlockIcon>
                                        <IconCloudDownload color={brandLight} />
                                    </BlockIcon>
                                    <BlockMetric>{estimates.trafficMb}GiB</BlockMetric>
                                    <EntertainmentExplanation>of data download</EntertainmentExplanation>
                                </EntertainmentBlock>
                                <EntertainmentBlock>
                                    <BlockIcon>
                                        <IconDocument color={brandLight} />
                                    </BlockIcon>
                                    <BlockMetric>{estimates.browsingMinutes}h</BlockMetric>
                                    <EntertainmentExplanation>Web browsing</EntertainmentExplanation>
                                </EntertainmentBlock>
                            </EntertainmentBlocks>
                        </>
                    )}
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
