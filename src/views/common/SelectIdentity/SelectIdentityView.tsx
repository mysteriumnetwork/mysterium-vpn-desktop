/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useRef } from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { faCircleNotch, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Currency } from "mysterium-vpn-js"
import { useToasts } from "react-toast-notifications"

import { useStores } from "../../../store"
import { brandDarker } from "../../../ui-kit/colors"
import { fmtMoney } from "../../../payment/display"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { QR } from "../../../ui-kit/components/QR/QR"

import identityBg from "./identity-bg.png"

const Container = styled.div`
    height: 100%;
    background: url(${identityBg});
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
`

const Title = styled.h1`
    margin: 0;
    padding: 32px 24px;
    font-weight: 300;
    font-size: 24px;
    color: ${brandDarker};
`

const InstructionsDiv = styled.div`
    padding: 0 24px;
    display: flex;
`

const RegistrationByTopup = styled.div`
    flex: 0.82;
`

const VerticalSplitter = styled.div`
    text-align: center;
    font-weight: bold;
    width: 52px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:before {
        content: ".";
        color: transparent;
        display: block;
        width: 1px;
        background: linear-gradient(
            to bottom,
            ${brandDarker} 40%,
            transparent 40%,
            transparent 60%,
            ${brandDarker} 60%
        );
        height: 100%;
        position: relative;
        left: 10px;
    }
`

const RegistrationByReferral = styled.div`
    flex: 0.4;
    padding-top: 48px;
`

const InstructionsText = styled.div`
    color: #404040;

    p {
        line-height: 20px;
        &:first-child {
            margin-top: 0;
        }
    }

    code {
        font-size: 11px;
    }
    small {
        font-size: 12px;
        line-height: 16px;
        color: #808080;
    }
`

const BottomBar = styled.div`
    height: 72px;
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const BlockchainStatus = styled.div`
    padding: 0 16px;
    p {
        font-weight: bold;
        color: #4d4d4d;
        margin: 0;
        margin-bottom: 4px;
    }
    small {
        font-size: 12px;
        line-height: 16px;
        color: #808080;
    }
`

const ApplyReferralCodeButton = styled(BrandButton)`
    margin-top: 8px;
    width: 100%;
`

export const SelectIdentityView: React.FC = observer(() => {
    const { identity, payment } = useStores()
    const { addToast } = useToasts()

    const chan = identity.identity?.channelAddress

    const registrationTopup = payment.registrationTopup
    const registrationFee = registrationTopup ? (
        fmtMoney({
            amount: registrationTopup,
            currency: Currency.MYST,
        })
    ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
    )

    const referralCode = useRef<HTMLInputElement>(null)
    const applyReferralCode = async () => {
        const token = referralCode.current?.value
        if (!token) {
            return
        }
        try {
            return await identity.registerWithReferralToken(token)
        } catch (err) {
            addToast(<span>Invalid token</span>, {
                appearance: "error",
                autoDismiss: true,
            })
            return
        }
    }
    return (
        <Container>
            <Title>Activate account</Title>
            <InstructionsDiv>
                <RegistrationByTopup>
                    <p>
                        To activate your account, transfer {registrationFee} MYST to your wallet <br />
                        (Görli Test Network blockchain)
                    </p>
                    <div style={{ paddingBottom: 16 }}>
                        <QR text={chan} />
                    </div>
                    <InstructionsText>
                        <small>
                            Do not send any other cryptocurrency to this address! Only MYST and ETH tokens are accepted.
                        </small>
                    </InstructionsText>
                </RegistrationByTopup>
                <VerticalSplitter>OR</VerticalSplitter>
                <RegistrationByReferral>
                    <p>Enter a referral code:</p>
                    <TextInput placeholder="Referral code" ref={referralCode} />
                    <ApplyReferralCodeButton onClick={applyReferralCode} loading={identity.loading}>
                        Apply
                    </ApplyReferralCodeButton>
                </RegistrationByReferral>
            </InstructionsDiv>
            <BottomBar>
                <FontAwesomeIcon icon={faCircleNotch} size="lg" spin />
                <BlockchainStatus>
                    <p>Waiting for transfer</p>
                    <small>Automatically scanning blockchain...</small>
                </BlockchainStatus>
            </BottomBar>
        </Container>
    )
})
