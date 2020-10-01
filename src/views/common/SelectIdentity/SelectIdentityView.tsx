/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { QRCode } from "react-qr-svg"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Currency } from "mysterium-vpn-js"

import { useStores } from "../../../store"
import { brandDarker } from "../../../ui-kit/colors"
import { Spinner } from "../../../ui-kit/components/Spinner/spinner"
import { fmtMoney } from "../../../payment/display"

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
    padding: 32px 32px 48px 32px;
    font-weight: 300;
    font-size: 24px;
    color: ${brandDarker};
`

const InstructionsDiv = styled.div`
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
`

const InstructionsText = styled.div`
    padding-right: 20px;
    color: #404040;

    p {
        line-height: 20px;
        &:first-child {
            margin-top: 0;
        }
    }

    code {
        font-size: 14px;
    }
    small {
        font-size: 12px;
        line-height: 16px;
        color: #808080;
    }
`
const Copy = styled.button`
    margin-left: 12px;
`

const ChannelQR = styled.div`
    flex: 0;
    height: 116px;
    width: 116px;
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

export const SelectIdentityView: React.FC = observer(() => {
    const { identity, payment } = useStores()
    const chan = identity.identity?.channelAddress

    const copyChannelAddress = (): void => {
        if (chan) {
            navigator.clipboard.writeText(chan)
        }
    }

    const registrationTopup = payment.registrationTopup
    const registrationFee = registrationTopup ? (
        fmtMoney({
            amount: registrationTopup,
            currency: Currency.MYST,
        })
    ) : (
        <FontAwesomeIcon icon={faSpinner} spin />
    )
    return (
        <Container>
            <Title>Activate account</Title>
            <InstructionsDiv>
                <InstructionsText>
                    <p>To activate your account, transfer {registrationFee} MYST to:</p>
                    <p>
                        <code>
                            <b>{chan}</b>
                        </code>
                        <Copy onClick={copyChannelAddress}>Copy</Copy>
                    </p>
                    <small>
                        Do not send any other cryptocurrency to this address! Only MYST and ETH tokens are accepted.
                    </small>
                </InstructionsText>
                <ChannelQR>{chan ? <QRCode value={chan} style={{ width: 116 }} /> : <></>}</ChannelQR>
            </InstructionsDiv>
            <BottomBar>
                <Spinner />
                <BlockchainStatus>
                    <p>Waiting for transfer</p>
                    <small>Automatically scanning blockchain...</small>
                </BlockchainStatus>
            </BottomBar>
        </Container>
    )
})
