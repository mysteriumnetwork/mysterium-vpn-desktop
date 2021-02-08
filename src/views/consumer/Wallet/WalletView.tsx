/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency } from "mysterium-vpn-js"
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import mosaicBg from "../../../ui-kit/assets/mosaic-bg.png"
import { useStores } from "../../../store"
import { fontMono, textHuge } from "../../../ui-kit/typography"
import { fmtMoney } from "../../../payment/display"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"
import { Modal } from "../../../ui-kit/components/Modal/Modal"
import { TopupView } from "../Topup/TopupView"
import { GhostButton } from "../../../ui-kit/components/Button/GhostButton"
import { ReceiveTokens } from "../ReceiveTokens/ReceiveTokens"

const Container = styled.div`
    background-image: url(${mosaicBg});
    background-position: 0 -5px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const Top = styled.div`
    color: #fff;
    padding: 0 24px;
`

const Identity = styled.div`
    box-sizing: border-box;
    height: 52px;
    display: flex;
    align-items: center;

    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`

const IdentityAddress = styled.div`
    user-select: text;
    line-height: 14px;
    ${fontMono}
`

const Balance = styled.div`
    margin: 24px 0;
`

const Amount = styled.div`
    ${textHuge}
    font-weight: bold;
`

const WalletActions = styled.div`
    margin: 24px 0;
    display: flex;
`

export const WalletView: React.FC = observer(() => {
    const { identity, payment } = useStores()
    const [topupModal, setTopupModal] = useState(false)
    const [receiveTokensModal, setReceiveTokensModal] = useState(false)
    const balanceDisplay = fmtMoney(
        {
            amount: identity.identity?.balance ?? 0,
            currency: Currency.MYSTTestToken,
        },
        {
            showCurrency: true,
            removeInsignificantZeros: false,
        },
    )
    const closeTopupModal = () => {
        setTopupModal(false)
        payment.clearOrder()
    }
    return (
        <Container>
            <Modal title="Topup" visible={topupModal} onClose={closeTopupModal}>
                <TopupView />
            </Modal>
            <Modal title="Receive MYSTT" visible={receiveTokensModal} onClose={() => setReceiveTokensModal(false)}>
                <ReceiveTokens />
            </Modal>
            <Top>
                <Identity>
                    Your Identity:&nbsp;
                    <IdentityAddress title={identity.identity?.registrationStatus ?? ""}>
                        {identity.identity?.id}
                    </IdentityAddress>
                </Identity>
                <Balance>
                    <p>Available balance</p>
                    <Amount>{balanceDisplay}</Amount>
                </Balance>
                <WalletActions>
                    <LightButton onClick={() => setTopupModal(true)}>
                        <FontAwesomeIcon icon={faDownload} size="1x" />
                        &nbsp;Topup
                    </LightButton>
                    <div style={{ width: 12 }} />
                    <GhostButton onClick={() => setReceiveTokensModal(true)}>
                        <FontAwesomeIcon icon={faUpload} size="1x" />
                        &nbsp;Receive MYSTT
                    </GhostButton>
                </WalletActions>
            </Top>
        </Container>
    )
})
