/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency } from "mysterium-vpn-js"
import { faIdCard } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { QRCode } from "react-qr-svg"

import mosaicBg from "../../../ui-kit/assets/mosaic-bg.png"
import { useStores } from "../../../store"
import { fontMono, textHuge } from "../../../ui-kit/typography"
import { fmtMoney } from "../../../payment/display"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"

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

const Split = styled.div`
    display: flex;
    flex-direction: row;
`

const Right = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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
`

const IdentityIcon = styled.div`
    padding-right: 16px;
`

const ChannelAddress = styled.code`
    user-select: text;
`

const ChannelQR = styled.div`
    flex: 0;
    margin-left: 32px;
    height: 116px;
    width: 116px;
    padding: 16px;
    background: #fff;
`

const Copy = styled.button`
    border-radius: 4px;
    margin-left: 8px;
    padding: 4px 8px;
    background: linear-gradient(180deg, #fefefe 0%, #f2f2f2 100%);
`

export const WalletView: React.FC = observer(() => {
    const { identity, navigation } = useStores()
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
    const chan = identity.identity?.channelAddress
    const copyChannelAddress = (): void => {
        if (chan) {
            navigator.clipboard.writeText(chan)
        }
    }
    const openTopupWindow = () => {
        navigation.toggleTopupWindow()
    }
    return (
        <Container>
            <Top>
                <Split>
                    <div>
                        <Identity>
                            <IdentityIcon>
                                <FontAwesomeIcon
                                    className="icon"
                                    icon={faIdCard}
                                    color="white"
                                    size="lg"
                                    title={identity.identity?.registrationStatus ?? ""}
                                />
                            </IdentityIcon>
                            <IdentityAddress title={identity.identity?.registrationStatus ?? ""}>
                                {identity.identity?.id}
                            </IdentityAddress>
                        </Identity>
                        <Balance>
                            <p>Available balance</p>
                            <Amount>{balanceDisplay}</Amount>
                        </Balance>
                        <p>Topup your wallet by sending MYSTT to the address below.</p>
                        <p>
                            <ChannelAddress>{chan}</ChannelAddress>
                            <Copy onClick={copyChannelAddress}>Copy</Copy>
                        </p>
                        <WalletActions>
                            <LightButton onClick={openTopupWindow}>Topup with crypto</LightButton>
                        </WalletActions>
                    </div>
                    <Right>
                        <ChannelQR>{chan ? <QRCode value={chan} style={{ width: 116 }} /> : <></>}</ChannelQR>
                    </Right>
                </Split>
            </Top>
        </Container>
    )
})
