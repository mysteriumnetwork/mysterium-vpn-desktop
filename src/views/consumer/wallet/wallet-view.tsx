/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import mosaicBg from "../../../ui-kit/assets/mosaic-bg.png"
import { useStores } from "../../../store"
import { fontMono, textHuge } from "../../../ui-kit/typography"
import { LightButton } from "../../../ui-kit/mbutton/light-button"

export const mystDisplay = (m?: number): string => {
    if (!m) {
        return Number(0).toFixed(3)
    }
    return (m / 100000000).toFixed(3)
}

const Container = styled.div`
    flex: 1;
    min-height: 0;
    background: url(${mosaicBg});

    display: flex;
    flex-direction: column;
`

const Top = styled.div`
    color: #fff;
    padding: 0 24px;
`

const Identity = styled.div`
    box-sizing: border-box;
    height: 52px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`

const IdentityStatus = styled.div``

const IdentityAddress = styled.div`
    ${fontMono}
`

const Balance = styled.div`
    margin: 24px 0;
`

const Amount = styled.div`
    ${textHuge}
    font-weight: bold;
`

const TestnetDisclaimer = styled.div`
    padding: 12px 24px;
    background: #2e1150;
    border-radius: 4px;
`

const WalletActions = styled.div`
    margin: 24px 0;
`

export const WalletView: React.FC = observer(() => {
    const { identity, payment } = useStores()
    const balanceDisplay = mystDisplay(identity.identity?.balance)
    const topUpAction = (): Promise<void> => payment.topUp()
    return (
        <Container>
            <Top>
                <Identity>
                    <IdentityStatus>Your identity {identity.identity?.registrationStatus ?? ""}</IdentityStatus>
                    <IdentityAddress>{identity.identity?.id}</IdentityAddress>
                </Identity>
                <Balance>
                    <p>Available balance</p>
                    <Amount>{balanceDisplay} MYSTT</Amount>
                </Balance>
                <TestnetDisclaimer>
                    MYSTT is a test token which you get for free while we are in the Testnet environment
                </TestnetDisclaimer>
                <WalletActions>
                    <LightButton onClick={topUpAction}>Top Up</LightButton>
                </WalletActions>
            </Top>
        </Container>
    )
})
