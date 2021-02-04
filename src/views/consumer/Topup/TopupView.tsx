/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { faCheckCircle, faCircleNotch, faExclamationCircle, faTimes } from "@fortawesome/free-solid-svg-icons"
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

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const Content = styled.div`
    padding: 40px 36px;
`

const Title = styled.div`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 24px;
`

const Alert = styled.div`
    margin-top: 160px;
    text-align: center;
`

const SectionTitle = styled.div`
    margin-bottom: 12px;
    font-size: 13px;
    color: #777;
    font-weight: bold;
`

const CloseButton = styled.div`
    position: fixed;
    left: 592px;
    padding: 16px;
    cursor: pointer;
`

const Select = styled.select`
    padding: 5px;
    margin: 0 24px 24px 0;
`

const LightningCheckbox = styled(Checkbox)``

const Currencies = styled.div`
    display: flex;
    flex-direction: row;
`

enum Progress {
    NONE,
    CREATING,
    CREATED,
}

export const TopupView: React.FC = observer(() => {
    const { navigation, payment } = useStores()
    const { addToast } = useToasts()
    const onClose = () => {
        navigation.toggleTopupWindow()
        payment.clearOrder()
        setProgress(Progress.NONE)
    }
    const [progress, setProgress] = useState(Progress.NONE)
    const createPaymentOrder = async () => {
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
                <CloseButton onClick={onClose}>
                    <FontAwesomeIcon className="icon" icon={faTimes} color="#404040" size="lg" />
                </CloseButton>
                <Content>
                    <Title>Topup Wallet</Title>
                </Content>
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
                <CloseButton onClick={onClose}>
                    <FontAwesomeIcon className="icon" icon={faTimes} color="#404040" size="lg" />
                </CloseButton>
                <Content>
                    <Title>Topup Wallet</Title>
                </Content>
                <Alert>
                    <FontAwesomeIcon className="icon" icon={faExclamationCircle} color="#E17055" size="lg" />
                    <span style={{ marginLeft: 12 }}>Payment failed. Please try again later.</span>
                </Alert>
            </Container>
        )
    }
    return (
        <Container>
            <CloseButton onClick={onClose}>
                <FontAwesomeIcon className="icon" icon={faTimes} color="#404040" size="lg" />
            </CloseButton>
            <Content>
                <Title>Topup Wallet</Title>
                <SectionTitle>Amount (min: {payment.orderMinimumAmount})</SectionTitle>
                <UncontrolledMystInputWithFlatEstimate
                    disabled={progress == Progress.CREATED}
                    rate={payment.mystToUsdRate?.amount}
                    defaultValue={payment.topupAmount}
                    onChange={(val) => payment.setTopupAmount(val)}
                    suffix={Currency.MYSTTestToken}
                />
                <SectionTitle>Currency</SectionTitle>
                <Currencies>
                    <Select
                        disabled={progress == Progress.CREATED}
                        onChange={(event) => {
                            payment.setPaymentCurrency(event.target.value)
                        }}
                    >
                        {payment.currencies.map((cur) => (
                            <option key={cur} value={cur}>
                                {cur}
                            </option>
                        ))}
                    </Select>
                    {isLightningAvailable(payment.paymentCurrency) && (
                        <LightningCheckbox
                            disabled={progress == Progress.CREATED}
                            checked={payment.lightningNetwork}
                            onChange={(): void => payment.setLightningNetwork(!payment.lightningNetwork)}
                        >
                            Use lightning network
                        </LightningCheckbox>
                    )}
                </Currencies>
                <div>
                    {progress == Progress.NONE && (
                        <BrandButton disabled={!payment.orderOptionsValid} onClick={createPaymentOrder}>
                            Start payment
                        </BrandButton>
                    )}
                    {progress == Progress.CREATING && <FontAwesomeIcon icon={faCircleNotch} size="lg" spin />}
                    {progress == Progress.CREATED && (
                        <>
                            <Title>
                                {payment.order?.payAmount} {payment.order?.payCurrency}
                            </Title>
                            <p>
                                Send the indicated amount to the address below. (
                                <Anchor
                                    onClick={() => {
                                        if (payment.order?.paymentUrl) {
                                            shell.openExternal(payment.order?.paymentUrl)
                                        }
                                    }}
                                >
                                    Pay in browser instead?
                                </Anchor>
                                )
                            </p>
                            <QR text={payment.order?.paymentAddress} />
                        </>
                    )}
                </div>
            </Content>
        </Container>
    )
})
