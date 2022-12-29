/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { faDollarSign, faEuroSign, faPoundSign, faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-hot-toast"
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
import { topupSteps } from "../../../../navigation/locations"
import { parseError } from "../../../../../shared/errors/parseError"
import { logErrorMessage } from "../../../../../shared/log/log"
import { dismissibleToast } from "../../../../ui-kit/components/dismissibleToast"
import { SelectTaxCountry } from "../../../../payment/components/SelectTaxCountry/SelectTaxCountry"
import { SelectTaxState } from "../../../../payment/components/SelectTaxState/SelectTaxState"
import { OptionLabel } from "../common/OptionLabel"
import { OptionValue } from "../common/OptionValue"

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

const OptionToggleGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 20px;
`

const OptionToggle = styled(Toggle)`
    width: 85px;
    height: 36px;
`

export const PaypalPaymentOptions: React.FC = observer(() => {
    const { payment } = useStores()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isOptionActive = (cur: string) => {
        return payment.paymentCurrency == cur
    }
    const selectOption = (cur: string) => () => {
        payment.setPaymentCurrency(cur)
    }
    const handleNextClick = async () => {
        setLoading(() => true)
        try {
            await payment.createOrder()
            setLoading(() => false)
            navigate("../" + topupSteps.paypalOrderSummary)
        } catch (err) {
            setLoading(() => false)
            const msg = parseError(err)
            logErrorMessage("Could not create a payment order", msg)
            toast.error(dismissibleToast(<span>{msg.humanReadable}</span>))
        }
    }
    useEffect(() => {
        if (payment.currencies.length === 1) {
            payment.setPaymentCurrency(payment.currencies[0])
        }
    }, [payment.currencies])
    const currencyGridVisible = payment.currencies.length > 1
    const usPaymentOptionsOK = payment.taxCountry === "US" ? payment.taxState : true
    const paymentOptionsOK = !loading && payment.paymentCurrency && payment.taxCountry && usPaymentOptionsOK
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
                        <TitleDescription>Select the payment options</TitleDescription>
                    </SideTop>
                    <SideBot>
                        {currencyGridVisible && (
                            <>
                                <OptionLabel>Payment currency:</OptionLabel>
                                <OptionToggleGrid>
                                    {payment.currencies.map((opt) => {
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
                                            <OptionToggle
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
                                            </OptionToggle>
                                        )
                                    })}
                                </OptionToggleGrid>
                            </>
                        )}
                        <OptionLabel>Tax residence: Country</OptionLabel>
                        <OptionValue>
                            <SelectTaxCountry />
                        </OptionValue>
                        {payment.taxCountry === "US" && (
                            <>
                                <OptionLabel>Tax residence: State</OptionLabel>
                                <OptionValue>
                                    <SelectTaxState />
                                </OptionValue>
                            </>
                        )}
                        <BrandButton
                            style={{ marginTop: "auto" }}
                            onClick={handleNextClick}
                            loading={loading}
                            disabled={!paymentOptionsOK}
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
