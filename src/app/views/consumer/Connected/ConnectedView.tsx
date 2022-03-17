/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ConnectionStatus } from "mysterium-vpn-js"
import styled from "styled-components"
import Lottie from "react-lottie-player"

import { useStores } from "../../../store"
import { Flag } from "../../../location/components/Flag/Flag"
import { DisconnectButton } from "../../../connection/components/DisconnectButton/DisconnectButton"
import { countryName } from "../../../location/countries"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"

import animationConnectingStart from "./animation_connecting_start.json"
import animationConnectingLoop from "./animation_connecting_loop.json"
import animationConnectedLoop from "./animation_connected_loop.json"
import { ConnectionStatistics } from "./ConnectionStatistics"
import { ConnectionProposal } from "./ConnectionProposal"

const SideTop = styled.div`
    height: 156px;
    padding: 17px 37px;
    overflow: hidden;
`

const Status = styled.div`
    text-align: center;
    font-size: 18px;
    line-height: 21px;
    font-weight: 500;
    margin-bottom: 18px;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    height: 330px;
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Action = styled.div`
    display: flex;
    button {
        flex: 1;
    }
`

const Animation = styled.div``
const LocationVisual = styled.div`
    position: absolute;
    z-index: 1;
    width: 378px;
    color: #fff;
`

const LocationFlag = styled(Flag).attrs({
    size: 35,
})``

const LocationCountry = styled.div`
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    height: 30px;
`

const LocationIP = styled.div`
    color: #ffffff88;
    text-align: center;
    height: 20px;
`

const ConnectionLocation = styled.div`
    width: 100%;
`

const ConnectionLocationFlag = styled.div`
    position: absolute;
    top: 88px;
    left: 171px;
`
const OriginalLocationFlag = styled.div`
    position: absolute;
    top: 360px;
    left: 171px;
`

const OriginalLocation = styled.div`
    position: absolute;
    width: 100%;
    top: 400px;
`

export const ConnectedView: React.FC = observer(function ConnectedView() {
    const {
        connection: { location, originalLocation, status, proposal },
    } = useStores()
    let statusText: string
    switch (status) {
        case ConnectionStatus.CONNECTING:
            statusText = "Connecting..."
            break
        case ConnectionStatus.CONNECTED:
            statusText = "Connected"
            break
        case ConnectionStatus.ON_HOLD:
            statusText = "Connection lost"
            break
        case ConnectionStatus.DISCONNECTING:
            statusText = "Disconnecting..."
            break
        case ConnectionStatus.NOT_CONNECTED:
            statusText = "Disconnected"
            break
        default:
            statusText = "Working on it..."
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    const [anim, setAnim] = useState<{ src: object; loop: boolean; onComplete?: () => void }>({
        src: animationConnectingStart,
        loop: false,
        onComplete: () => {
            setAnim({
                src: animationConnectingLoop,
                loop: true,
            })
        },
    })
    useEffect(() => {
        if (status === ConnectionStatus.CONNECTED) {
            setAnim({
                src: animationConnectedLoop,
                loop: true,
            })
        }
    }, [status])

    return (
        <ViewContainer>
            <ViewNavBar />
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <Status>{statusText}</Status>
                        <ConnectionProposal />
                    </SideTop>
                    <SideBot>
                        <ConnectionStatistics />
                        <Action>
                            <DisconnectButton />
                        </Action>
                    </SideBot>
                </ViewSidebar>
                <ViewContent>
                    <Animation>
                        <Lottie
                            play
                            loop={anim.loop}
                            animationData={anim.src}
                            onComplete={anim.onComplete}
                            style={{ width: 378, height: 486 }}
                            renderer="svg"
                        />
                    </Animation>

                    <LocationVisual>
                        <ConnectionLocation>
                            <LocationCountry>{countryName(proposal?.country)}</LocationCountry>
                            <LocationIP>{location?.ip}</LocationIP>
                        </ConnectionLocation>
                        <ConnectionLocationFlag>
                            <LocationFlag countryCode={proposal?.country} />
                        </ConnectionLocationFlag>
                        <OriginalLocationFlag>
                            <LocationFlag countryCode={originalLocation?.country} />
                        </OriginalLocationFlag>
                        <OriginalLocation>
                            <LocationCountry>{countryName(originalLocation?.country)}</LocationCountry>
                            <LocationIP>{originalLocation?.ip}</LocationIP>
                        </OriginalLocation>
                    </LocationVisual>
                </ViewContent>
            </ViewSplit>
        </ViewContainer>
    )
})
