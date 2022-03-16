/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency } from "mysterium-vpn-js"
import { useNavigate } from "react-router-dom"

import { useStores } from "../../../../store"
import { BrandButton } from "../../../../ui-kit/components/Button/BrandButton"
import { ViewContainer } from "../../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../../ui-kit/icons/IconWallet"
import { Heading2, Small } from "../../../../ui-kit/typography"
import { brandLight, lightBlue } from "../../../../ui-kit/colors"
import { Toggle } from "../../../../ui-kit/components/Toggle/Toggle"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { MystChain } from "../../../../payment/store"
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

const MethodToggle = styled(Toggle).attrs({
    height: "63px",
})`
    height: 63px;
    margin-bottom: 10px;
    font-size: 18px;
    line-height: 21px;
    font-weight: bold;
`

export const MystChooseChain: React.FC = observer(() => {
    const { payment } = useStores()
    const navigate = useNavigate()
    const isOptionActive = (chain: MystChain) => {
        return payment.chain == chain
    }
    const selectOption = (chain: MystChain) => () => {
        payment.setChain(chain)
    }
    const handleNextClick = async () => {
        switch (payment.chain) {
            case MystChain.POLYGON:
                navigate("../" + topupSteps.mystPolygonWaitingForPayment)
                break
            case MystChain.ETHEREUM:
                payment.setPaymentCurrency(Currency.MYST)
                navigate("../" + topupSteps.mystSelectAmount)
                break
        }
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
                        <TitleDescription>Choose chain for MYST deposit</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <MethodToggle
                            key="polygon"
                            inactiveColor={lightBlue}
                            height="63px"
                            justify="center"
                            active={isOptionActive(MystChain.POLYGON)}
                            onClick={selectOption(MystChain.POLYGON)}
                        >
                            Polygon (MATIC)
                        </MethodToggle>
                        <MethodToggle
                            key="ethereum"
                            inactiveColor={lightBlue}
                            height="63px"
                            justify="center"
                            active={isOptionActive(MystChain.ETHEREUM)}
                            onClick={selectOption(MystChain.ETHEREUM)}
                        >
                            Ethereum
                        </MethodToggle>
                        <BrandButton style={{ marginTop: "auto" }} onClick={handleNextClick} disabled={!payment.chain}>
                            Next
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <ViewContent />
            </ViewSplit>
        </ViewContainer>
    )
})
