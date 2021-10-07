/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import toast from "react-hot-toast"
import { faDollarSign, faEuroSign, faPoundSign, faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useStores } from "../../../../store"
import { BrandButton } from "../../../../ui-kit/components/Button/BrandButton"
import { ViewContainer } from "../../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../../ui-kit/icons/IconWallet"
import { Heading2, Paragraph, Small } from "../../../../ui-kit/typography"
import { brandLight, lightBlue } from "../../../../ui-kit/colors"
import { Toggle } from "../../../../ui-kit/components/Toggle/Toggle"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { topupSteps } from "../../../../navigation/locations"
import { displayUSD } from "../../../../payment/display"
import { parseError } from "../../../../../shared/errors/parseError"
import { logErrorMessage } from "../../../../../shared/log/log"
import { dismissibleToast } from "../../../../ui-kit/components/dismissibleToast"

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
    margin-bottom: 20px;
`

const AmountToggle = styled(Toggle)`
    width: 85px;
    height: 36px;
`

const OptionValue = styled(Heading2)``

export const CardinitySelectCurrency: React.FC = observer(() => {
    const { payment, router } = useStores()
    const [loading, setLoading] = useState(false)
    const isOptionActive = (cur: string) => {
        return payment.paymentCurrency == cur
    }
    const selectOption = (cur: string) => () => {
        payment.setPaymentCurrency(cur)
    }
    const fiatAmount = displayUSD(payment.fiatEquivalent(payment.topupAmount ?? 0))
    const handleNextClick = async () => {
        setLoading(() => true)
        try {
            await payment.createOrder()
            setLoading(() => false)
            router.pushRelative(topupSteps.cardinityWaitingForPayment)
        } catch (err) {
            setLoading(() => false)
            const msg = parseError(err)
            logErrorMessage("Could not create a payment order", msg)
            msg.humanReadable = "Could not initiate the payment. Please try again later or contact us via chat!"
            toast.error(dismissibleToast(<span>{msg.humanReadable}</span>))
        }
    }
    const options = payment.paymentMethod?.currencies || []
    return (
        <ViewContainer>
            <ViewNavBar onBack={() => router.history?.goBack()}>
                <div style={{ width: 375, textAlign: "center" }}>
                    <StepProgressBar step={1} />
                </div>
            </ViewNavBar>
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconWallet color={brandLight} />
                        <Title>Top up your account</Title>
                        <TitleDescription>Select the payment currency.</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <AmountSelect>
                            {options.map((opt) => {
                                let currencyIcon = faQuestionCircle
                                switch (opt) {
                                    case "EUR":
                                        currencyIcon = faEuroSign
                                        break
                                    case "USD":
                                        currencyIcon = faDollarSign
                                        break
                                    case "GBP":
                                        currencyIcon = faPoundSign
                                        break
                                }
                                return (
                                    <AmountToggle
                                        key={opt}
                                        active={isOptionActive(opt)}
                                        onClick={selectOption(opt)}
                                        inactiveColor={lightBlue}
                                        height="36px"
                                        justify="center"
                                    >
                                        <div style={{ textAlign: "center" }}>
                                            <OptionValue>
                                                <FontAwesomeIcon icon={currencyIcon} fixedWidth size="sm" />
                                                {opt}
                                            </OptionValue>
                                        </div>
                                    </AmountToggle>
                                )
                            })}
                        </AmountSelect>
                        <Paragraph style={{ borderTop: "1px solid #ddd", paddingTop: 10 }}>
                            Estimated USD total:<span style={{ float: "right", fontWeight: "bold" }}>{fiatAmount}</span>
                        </Paragraph>
                        <BrandButton
                            style={{ marginTop: "auto" }}
                            onClick={handleNextClick}
                            loading={loading}
                            disabled={loading || !payment.paymentCurrency}
                        >
                            Next
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <ViewContent />
            </ViewSplit>
        </ViewContainer>
    )
})
