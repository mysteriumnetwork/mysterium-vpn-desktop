/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import { Currency } from "mysterium-vpn-js"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"

import { useStores } from "../../../../store"
import { BrandButton } from "../../../../ui-kit/components/Button/BrandButton"
import { ViewContainer } from "../../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../../ui-kit/icons/IconWallet"
import { Heading2, Paragraph, Small } from "../../../../ui-kit/typography"
import { brandLight } from "../../../../ui-kit/colors"
import { isLightningAvailable } from "../../../../payment/currency"
import { Checkbox } from "../../../../ui-kit/form-components/Checkbox/Checkbox"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { topupSteps } from "../../../../navigation/locations"
import { CryptoAnimation } from "../../../../ui-kit/components/CryptoAnimation/CryptoAnimation"
import { parseError } from "../../../../../shared/errors/parseError"
import { logErrorMessage } from "../../../../../shared/log/log"
import { dismissibleToast } from "../../../../ui-kit/components/dismissibleToast"
import { Select } from "../../../../ui-kit/form-components/Select"
import { SelectTaxCountry } from "../../../../payment/components/SelectTaxCountry/SelectTaxCountry"
import { SelectTaxState } from "../../../../payment/components/SelectTaxState/SelectTaxState"
import { OptionValue } from "../common/OptionValue"
import { OptionLabel } from "../common/OptionLabel"

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

const LightningCheckbox = styled(Checkbox)``

export const CoingatePaymentOptions: React.FC = observer(() => {
    const { payment } = useStores()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const setUseLightning = (): void => {
        const val = !payment.lightningNetwork
        payment.setLightningNetwork(val)
    }

    const handleNextClick = async () => {
        setLoading(() => true)
        try {
            await payment.createOrder()
            setLoading(() => false)
            navigate("../" + topupSteps.coingateOrderSummary)
        } catch (err) {
            setLoading(() => false)
            const msg = parseError(err)
            logErrorMessage("Could not create a payment order", msg)
            toast.error(dismissibleToast(<span>{msg.humanReadable}</span>))
        }
    }
    const options = payment.paymentMethod?.gatewayData.currencies.filter((it) => it !== Currency.MYST) || []
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
                        {payment.paymentCurrency !== Currency.MYST && (
                            <>
                                <OptionLabel>Payment currency</OptionLabel>
                                <OptionValue>
                                    <Select
                                        value={payment.paymentCurrency}
                                        onChange={(event) => payment.setPaymentCurrency(event.target.value)}
                                    >
                                        <option key="" value=""></option>
                                        {options.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </Select>
                                </OptionValue>
                            </>
                        )}
                        {isLightningAvailable(payment.paymentCurrency) && (
                            <OptionValue>
                                <LightningCheckbox checked={payment.lightningNetwork} onChange={setUseLightning}>
                                    Use lightning network
                                </LightningCheckbox>
                            </OptionValue>
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
                        {payment.paymentCurrency == Currency.MYST && (
                            <Paragraph style={{ color: "red" }}>
                                <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: 5 }} />
                                {Currency.MYST} is currently only supported on the Ethereum network!
                            </Paragraph>
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
                <ViewContent>
                    <div style={{ paddingTop: 100 }}>
                        <CryptoAnimation currency={payment.paymentCurrency} />
                    </div>
                </ViewContent>
            </ViewSplit>
        </ViewContainer>
    )
})
