/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { ConnectionStatus } from "mysterium-vpn-js"
import toast from "react-hot-toast"
import Lottie from "react-lottie-player"

import { CountryFilter } from "../../../proposals/components/CountryFilter/CountryFilter"
import { useStores } from "../../../store"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { brand } from "../../../ui-kit/colors"
import { Preset } from "../../../proposals/components/Preset/Preset"

import animationSmartConnect from "./animation_smart_connect.json"
import { SwitchConnectView } from "./SwitchConnectView"

const Sidebar = styled(ViewSidebar)`
    background: linear-gradient(to bottom, #f8f8fd 50%, ${brand} 50%);
`

const SideTop = styled.div<{ presetCount: number }>`
    box-sizing: border-box;
    height: ${(props) => props.presetCount * 30 + 24}px;
    padding: 12px;
    overflow: hidden;
    text-align: center;
    flex: 0 0 auto;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 12px 0;

    flex: 1 1 auto;
    height: 272px;

    display: flex;
    flex-direction: column;
`

const SmartConnectButton = styled.div`
    background: ${brand};
    color: #fff;
    font-size: 18px;
    height: 63px;
    line-height: 63px;
    text-align: center;
    flex: 0 0 auto;

    &:hover {
        filter: brightness(98%);
    }
    &:before {
        display: block;
        position: absolute;
        content: " ";
        width: 10px;
        height: 10px;
        background: #fff;
        transform: rotate(45deg);
        margin-left: 110px;
        margin-top: -5px;
    }
`

export const SmartConnectView: React.FC = observer(() => {
    const { proposals, connection } = useStores()
    const handleConnectClick = async (): Promise<void> => {
        if (connection.status === ConnectionStatus.NOT_CONNECTED) {
            try {
                return await connection.smartConnect()
            } catch (reason) {
                toast.error(function errorToast() {
                    return (
                        <span>
                            <b>Oops! Could not connect 😶</b>
                            <br />
                            {reason}
                        </span>
                    )
                })
                return
            }
        }
        return await connection.disconnect()
    }
    return (
        <ViewContainer>
            <ViewNavBar>
                <SwitchConnectView />
            </ViewNavBar>
            <ViewSplit>
                <Sidebar>
                    <SideTop presetCount={proposals.filterPresets.length || 4}>
                        <Preset />
                    </SideTop>
                    <SideBot>
                        <CountryFilter />
                    </SideBot>
                    <SmartConnectButton onClick={handleConnectClick}>Connect</SmartConnectButton>
                </Sidebar>
                <ViewContent>
                    <div>
                        <Lottie
                            play
                            loop={true}
                            animationData={animationSmartConnect}
                            style={{ width: 378, height: 486 }}
                            renderer="svg"
                        />
                    </div>
                </ViewContent>
            </ViewSplit>
        </ViewContainer>
    )
})
