/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"

import { useStores } from "../../../store"
import { QR } from "../../../ui-kit/components/QR/QR"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 12px;
`

const Disclaimer = styled.div`
    color: #d63031;
    font-weight: 400;
`

export const ReceiveTokens: React.FC = observer(() => {
    const { identity } = useStores()
    return (
        <Container>
            <p>Topup your wallet by sending MYSTT to the address below.</p>
            <Disclaimer>
                <FontAwesomeIcon icon={faExclamationTriangle} /> NOTE: MYSTT is a test token of Ethereum Görli testnet.
                Don&apos;t send real MYST tokens to this address, they may be lost forever!
            </Disclaimer>
            <QR text={identity.identity?.channelAddress} />
        </Container>
    )
})
