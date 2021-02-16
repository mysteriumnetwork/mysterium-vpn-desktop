/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Currency } from "mysterium-vpn-js"
import { useToasts } from "react-toast-notifications"
import { shell } from "electron"

import { useStores } from "../../../store"
import { UncontrolledMystInputWithFlatEstimate } from "../../../ui-kit/form-components/MystInputWithFlatEstimate"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { QR } from "../../../ui-kit/components/QR/QR"
import { Checkbox } from "../../../ui-kit/form-components/Checkbox/Checkbox"
import { isLightningAvailable } from "../../../payment/currency"
import { log } from "../../../log/log"
import { Anchor } from "../../../ui-kit/components/Anchor"
import { OrderStatus } from "../../../payment/store"
import { Spinner } from "../../../ui-kit/components/Spinner/Spinner"
import { userEvent } from "../../../analytics/analytics"
import { WalletAction } from "../../../analytics/actions"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 12px;
`

const Title = styled.div`
    user-select: text;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
`

const Alert = styled.div`
    margin-top: 110px;
    text-align: center;
`

const SectionTitle = styled.div`
    margin-bottom: 12px;
`

const Select = styled.select`
    padding: 5px;
    margin: 0 24px 0 0;
`

const LightningCheckbox = styled(Checkbox)``

const FormRow = styled.div`
    margin-bottom: 12px;
`

const Currencies = styled.div`
    display: flex;
    flex-direction: row;
`

const Actions = styled.div`
    margin-top: auto;
`

enum Progress {
    NONE,
    CREATING,
    CREATED,
}

export const TopupView: React.FC = observer(() => {
    const { payment } = useStores()
    const { addToast } = useToasts()
    const [progress, setProgress] = useState(Progress.NONE)
    useEffect(() => {
        if (payment.order == null) {
            setProgress(Progress.NONE)
        }
    }, [payment.order])
    const onCreatePaymentClick = async () => {
        userEvent(WalletAction.CreatePayment)
        try {
            setProgress(Progress.CREATING)
            await payment.createOrder()
            setProgress(Progress.CREATED)
        } catch (err) {
            setProgress(Progress.NONE)
            log.error("Could not create a payment order", err.message)
            addToast(`Something went wrong`, {
                appearance: "error",
                autoDismiss: true,
            })
        }
    }
    if (payment.orderStatus == OrderStatus.SUCCESS) {
        return (
            <Container>
                <Alert>
                    <FontAwesomeIcon className="icon" icon={faCheckCircle} color="#55efc4" size="lg" />
                    <span style={{ marginLeft: 12 }}>Payment successful! MYSTT will be credited shortly.</span>
                </Alert>
            </Container>
        )
    }
    if (payment.orderStatus == OrderStatus.FAILED) {
        return (
            <Container>
                <Alert>
                    <FontAwesomeIcon className="icon" icon={faExclamationCircle} color="#E17055" size="lg" />
                    <span style={{ marginLeft: 12 }}>Payment failed. Please try again later.</span>
                </Alert>
            </Container>
        )
    }
    if (progress == Progress.CREATING) {
        return (
            <Container>
                <div style={{ textAlign: "center", marginTop: 60 }}>
                    <p>Generating payment details</p>
                    <Spinner dark />
                </div>
            </Container>
        )
    }
    if (progress == Progress.CREATED) {
        const onPayInBrowserClick = () => {
            userEvent(WalletAction.PayInBrowser)
            if (payment.order?.paymentUrl) {
                shell.openExternal(payment.order?.paymentUrl)
            }
        }
        return (
            <Container>
                <div>
                    {progress == Progress.CREATED && (
                        <>
                            <Title>
                                {payment.order?.payAmount} {payment.order?.payCurrency}
                            </Title>
                            <div>
                                Send the indicated amount to the address below. (
                                <Anchor onClick={onPayInBrowserClick}>Pay in browser instead?</Anchor>)
                            </div>
                            <QR height={140} text={payment.order?.paymentAddress} />
                        </>
                    )}
                </div>
            </Container>
        )
    }
    const onTopupAmountChange = (val?: number): void => {
        userEvent(WalletAction.ChangeTopupAmount, String(val))
        payment.setTopupAmount(val)
    }
    const onCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value
        userEvent(WalletAction.ChangeTopupCurrency, val)
        payment.setPaymentCurrency(val)
    }
    const onLightningChange = (): void => {
        const val = !payment.lightningNetwork
        userEvent(WalletAction.UseLightningNetwork, String(val))
        payment.setLightningNetwork(val)
    }
    return (
        <Container>
            <FormRow>
                <SectionTitle>Amount (min: {payment.orderMinimumAmount})</SectionTitle>
                <UncontrolledMystInputWithFlatEstimate
                    disabled={progress != Progress.NONE}
                    rate={payment.mystToUsdRate?.amount}
                    defaultValue={payment.topupAmount}
                    onChange={onTopupAmountChange}
                    suffix={Currency.MYSTTestToken}
                />
            </FormRow>
            <FormRow>
                <SectionTitle>Currency</SectionTitle>
                <Currencies>
                    <Select disabled={progress != Progress.NONE} onChange={onCurrencyChange}>
                        {payment.currencies.map((cur) => (
                            <option key={cur} value={cur}>
                                {cur}
                            </option>
                        ))}
                    </Select>
                </Currencies>
            </FormRow>
            {isLightningAvailable(payment.paymentCurrency) && (
                <FormRow>
                    <LightningCheckbox
                        disabled={progress != Progress.NONE}
                        checked={payment.lightningNetwork}
                        onChange={onLightningChange}
                    >
                        Use lightning network
                    </LightningCheckbox>
                </FormRow>
            )}
            <Actions>
                {progress == Progress.NONE && (
                    <BrandButton disabled={!payment.orderOptionsValid} onClick={onCreatePaymentClick}>
                        Start payment
                    </BrandButton>
                )}
            </Actions>
        </Container>
    )
})
