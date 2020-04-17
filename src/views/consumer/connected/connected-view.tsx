/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import { ConnectionStatus } from "mysterium-vpn-js"
import styled from "styled-components"

import { useStores } from "../../../store"
import logoWhiteConnected from "../../../../assets/logo-white-connected.png"
import mosaicBg from "../../../ui-kit/assets/mosaic-bg.png"
import { resolveCountry } from "../../../location/countries"
import { ConnectDisconnectButton } from "../../../connection/comp/connect-disconnect-button"

import { ConnectionProposal } from "./connection-proposal"
import { ConnectionStatistics } from "./connection-statistics"

const Container = styled.div`
    height: 100%;
    background: url(${mosaicBg});
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    color: #fff;
`

const Status = styled.h1`
    margin: 0;
    margin-top: 32px;
    text-align: center;
    font-weight: 300;
    font-size: 24px;
`

const LocationVisual = styled.div`
    box-sizing: border-box;
    width: 464px;
    height: 108px;
    margin: 64px auto 0;

    background: url(${logoWhiteConnected});
    background-repeat: no-repeat;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Flag = styled.img`
    padding: 16px;
`

const ConnectionIP = styled.div`
    text-align: center;
    width: 130px;
    margin: -15px 50px 10px auto;
`

const ActionButtons = styled.div`
    margin: 0 auto;
`

const BottomBar = styled.div`
    margin-top: auto;
    box-sizing: border-box;
    height: 64px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`

export const ConnectedView: React.FC = observer(() => {
    const {
        connection: { location, originalLocation, status },
    } = useStores()
    let statusText: string
    switch (status) {
        case ConnectionStatus.CONNECTING:
            statusText = "Connecting..."
            break
        case ConnectionStatus.CONNECTED:
            statusText = "Your connection is secure"
            break
        case ConnectionStatus.DISCONNECTING:
            statusText = "Disconnecting..."
            break
        case ConnectionStatus.NOT_CONNECTED:
            statusText = "Your connection is unprotected"
            break
        default:
            statusText = "Working on it..."
    }
    const countryFrom = resolveCountry(originalLocation?.country)
    const countryTo = resolveCountry(location?.country)

    return (
        <Container>
            <Status>{statusText}</Status>
            <LocationVisual>
                <Flag src={countryFrom.flag} />
                <Flag src={countryTo.flag} />
            </LocationVisual>
            <ConnectionIP>{location?.ip}</ConnectionIP>
            <ConnectionProposal />
            <ActionButtons>
                <ConnectDisconnectButton />
            </ActionButtons>
            <BottomBar>
                <ConnectionStatistics />
            </BottomBar>
        </Container>
    )
})
