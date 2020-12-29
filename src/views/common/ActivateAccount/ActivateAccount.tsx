/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons"
import { Currency } from "mysterium-vpn-js"
import { useToasts } from "react-toast-notifications"

import { brandDarker } from "../../../ui-kit/colors"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import {
    ControlledMystInputWithFlatEstimate,
    UncontrolledMystInputWithFlatEstimate,
} from "../../../ui-kit/form-components/MystInputWithFlatEstimate"
import { useStores } from "../../../store"
import { textSmall } from "../../../ui-kit/typography"
import { Checkbox } from "../../../ui-kit/form-components/Checkbox/Checkbox"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { log } from "../../../log/log"
import { locations } from "../../../navigation/locations"

const Container = styled.div`
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
`

const Content = styled.div`
    flex: 1;
    padding: 32px 20px 0 20px;
`

const ActionBar = styled.div`
    height: 72px;
    padding: 0 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #e3e3e3;
    box-sizing: border-box;
    background: #f7f7f7;
`

const Title = styled.h1`
    font-weight: 300;
    font-size: 24px;
    line-height: 32px;
    padding: 0;
    margin: 0;
    margin-bottom: 16px;
    letter-spacing: 1px;
    color: ${brandDarker};
`

const ExplainActivation = styled.p`
    font-size: 14px;
    line-height: 24px;
    margin: 0;
    padding: 0;
    margin-bottom: 16px;
`

const LineItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const Label = styled.p`
    margin: 8px 0 0 0;
`

const ExplainLabel = styled.p`
    ${textSmall}
    margin: 0 0 16px 0;
`
const TotalBreak = styled.div`
    width: 100%;
    height: 1px;
    background: #d8d8d8;
    margin: 24px 0;
`

export const ActivateAccount: React.FC = observer(() => {
    const { payment, identity, router } = useStores()
    const { addToast } = useToasts()
    const [state, setState] = useState({
        useReferralCode: false,
        referralCode: "",
    })
    const buttonAction = async () => {
        if (state.useReferralCode) {
            try {
                await identity.registerWithReferralToken(state.referralCode)
            } catch (err) {
                addToast("Could not register with the given token", {
                    appearance: "error",
                    autoDismiss: true,
                })
                log.error("Could not register with the given token", err.message)
            }
        } else {
            router.push(locations.activateTopup)
        }
    }
    const handleUseReferralCodeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const useReferralCode = evt.target.checked
        setState((prevState) => ({ ...prevState, useReferralCode }))
    }
    const handleReferralCodeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const referralCode = evt.target.value
        setState((prevState) => ({ ...prevState, referralCode }))
    }
    return (
        <Container>
            <Content>
                <Title>
                    <FontAwesomeIcon icon={faShieldAlt} /> Activate Account
                </Title>
                <ExplainActivation>
                    Mysterium VPN requires account activation to prevent spam and network attacks.
                </ExplainActivation>
                <LineItem style={{ marginBottom: 16 }}>
                    <Checkbox checked={state.useReferralCode} onChange={handleUseReferralCodeChange}>
                        I have a referral code
                    </Checkbox>
                </LineItem>
                {state.useReferralCode && (
                    <LineItem style={{ marginBottom: 16 }}>
                        <TextInput onChange={handleReferralCodeChange} />
                    </LineItem>
                )}
                <div style={{ opacity: state.useReferralCode ? 0.4 : 1 }}>
                    <LineItem>
                        <Label>Registration Fee</Label>
                        <ControlledMystInputWithFlatEstimate
                            disabled
                            rate={payment.mystToUsdRate?.value}
                            value={payment.registrationFee}
                            suffix={Currency.MYSTTestToken}
                        />
                    </LineItem>
                    <ExplainLabel>The registration fee is fixed and the same for all network users.</ExplainLabel>
                    <LineItem>
                        <Label>Top-up Amount</Label>
                        <UncontrolledMystInputWithFlatEstimate
                            rate={payment.mystToUsdRate?.value}
                            defaultValue={payment.registrationTopupAmount}
                            onChange={(val) => payment.setRegistrationTopupAmount(val)}
                            suffix={Currency.MYSTTestToken}
                        />
                    </LineItem>
                    <ExplainLabel>
                        <strong>Optional, but strongly recommended</strong>: these funds will be paid to other network
                        participants for providing services. This amount can be always withdrawn later.
                    </ExplainLabel>
                    <TotalBreak />
                    <LineItem>
                        <Label>
                            <strong>Total</strong>
                        </Label>
                        <ControlledMystInputWithFlatEstimate
                            disabled
                            rate={payment.mystToUsdRate?.value}
                            value={payment.topupTotal}
                            suffix={Currency.MYSTTestToken}
                        />
                    </LineItem>
                </div>
            </Content>
            <ActionBar>
                <BrandButton onClick={buttonAction} loading={identity.loading}>
                    {state.useReferralCode ? "Submit" : "Payment information"}
                </BrandButton>
            </ActionBar>
        </Container>
    )
})
