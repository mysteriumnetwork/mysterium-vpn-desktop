/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { faCircleNotch, faShieldAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useStores } from "../../../store"
import { brandDarker } from "../../../ui-kit/colors"
import { displayMYST } from "../../../payment/display"
import { QR } from "../../../ui-kit/components/QR/QR"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { locations } from "../../../navigation/locations"

import identityBg from "./identity-bg.png"

const Container = styled.div`
    height: 100%;
    background: url(${identityBg});
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
`

const Content = styled.div`
    flex: 1;
    padding: 32px 20px 0 20px;
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

const InstructionsDiv = styled.div`
    display: flex;
`

const RegistrationByTopup = styled.div`
    flex: 1;
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
    padding: 0 20px;
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const BlockchainStatus = styled.div`
    margin-left: 16px;
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

export const ActivateAccountTopup: React.FC = observer(() => {
    const { identity, payment, router } = useStores()

    const chan = identity.identity?.channelAddress
    const topupAmount = displayMYST(payment.topupTotal ?? 0)
    const handleBackAction = () => {
        router.push(locations.activate)
    }

    return (
        <Container>
            <Content>
                <Title>
                    <FontAwesomeIcon icon={faShieldAlt} /> Activate Account
                </Title>
                <InstructionsDiv>
                    <RegistrationByTopup>
                        <p>
                            To activate your account, transfer {topupAmount} to your wallet (Görli Testnet blockchain)
                        </p>
                        <div style={{ paddingBottom: 16 }}>
                            <QR text={chan} />
                        </div>
                        <InstructionsText>
                            <small>
                                Do not send any other cryptocurrency to this address! Only MYST tokens are accepted.
                            </small>
                        </InstructionsText>
                    </RegistrationByTopup>
                </InstructionsDiv>
            </Content>
            <BottomBar>
                <div style={{ marginRight: "auto" }}>
                    <BrandButton onClick={handleBackAction}>Back</BrandButton>
                </div>
                <FontAwesomeIcon icon={faCircleNotch} size="lg" spin />
                <BlockchainStatus>
                    <p>Waiting for transfer</p>
                    <small>Automatically scanning blockchain...</small>
                </BlockchainStatus>
            </BottomBar>
        </Container>
    )
})
