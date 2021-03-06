/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { useToasts } from "react-toast-notifications"

import { useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { userEvent } from "../../../analytics/analytics"
import { WalletAction } from "../../../../shared/analytics/actions"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { Heading2, Small } from "../../../ui-kit/typography"
import { brandLight, lightBlue } from "../../../ui-kit/colors"
import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"
import { displayUSD } from "../../../payment/display"
import { isLightningAvailable } from "../../../payment/currency"
import { Checkbox } from "../../../ui-kit/form-components/Checkbox/Checkbox"
import { locations } from "../../../navigation/locations"
import { log } from "../../../../shared/log/log"
import { StepProgressBar } from "../../../ui-kit/components/StepProgressBar/StepProgressBar"

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

const FiatEquivalent = styled.div`
    margin-top: auto;
    text-align: center;
    font-size: 11px;
`

const LightningCheckbox = styled(Checkbox)``

export const TopupSelectCurrency: React.FC = observer(() => {
    const { payment, router } = useStores()
    const { addToast } = useToasts()
    const [loading, setLoading] = useState(false)

    const isOptionActive = (cur: string) => {
        return payment.paymentCurrency == cur
    }
    const selectOption = (cur: string) => () => {
        userEvent(WalletAction.ChangeTopupCurrency, cur)
        payment.setPaymentCurrency(cur)
    }
    const setUseLightning = (): void => {
        const val = !payment.lightningNetwork
        userEvent(WalletAction.UseLightningNetwork, String(val))
        payment.setLightningNetwork(val)
    }

    const handleNextClick = async () => {
        userEvent(WalletAction.CreatePayment)
        setLoading(() => true)
        try {
            await payment.createOrder()
            setLoading(() => false)
            router.push(locations.walletTopupWaitingForPayment)
        } catch (err) {
            setLoading(() => false)
            log.error("Could not create a payment order", err.message)
            let userMessage = "Could not inititate the payment. Please try again later or contact us via chat!"
            // We can remove this hack later; this is a special message for ids registered during 'offchain' period.
            if ((err.message as string).indexOf("identity is offchain") != -1) {
                userMessage =
                    "There seems to be a problem with your account. Please create a new identity to continue using MysteriumVPN."
            }
            addToast(userMessage, {
                appearance: "error",
                autoDismiss: true,
            })
        }
    }
    const options = payment.currencies
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
                        <TitleDescription>Select the cryptocurrency in which the topup will be done</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <AmountSelect>
                            {options.map((opt) => (
                                <AmountToggle
                                    key={opt}
                                    active={isOptionActive(opt)}
                                    onClick={selectOption(opt)}
                                    inactiveColor={lightBlue}
                                    height="36px"
                                    justify="center"
                                >
                                    <div style={{ textAlign: "center" }}>
                                        <OptionValue>{opt}</OptionValue>
                                    </div>
                                </AmountToggle>
                            ))}
                        </AmountSelect>
                        {isLightningAvailable(payment.paymentCurrency) && (
                            <LightningCheckbox checked={payment.lightningNetwork} onChange={setUseLightning}>
                                Use lightning network
                            </LightningCheckbox>
                        )}
                        <FiatEquivalent>
                            {payment.appFiatCurrency} equivalent ≈{" "}
                            {displayUSD(payment.fiatEquivalent(payment.topupAmount ?? 0))}
                        </FiatEquivalent>
                        <BrandButton
                            style={{ marginTop: "15px" }}
                            onClick={handleNextClick}
                            loading={loading}
                            disabled={loading || !payment.paymentCurrency}
                        >
                            Next
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <ViewContent>{/* TODO: entertainment estimates here */}</ViewContent>
            </ViewSplit>
        </ViewContainer>
    )
})
