/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"

import { useStores } from "../../../store"
import { locations } from "../../../navigation/locations"
import { brand } from "../../../ui-kit/colors"

const Container = styled.div`
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
`
const SwitchGroup = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid ${brand};
    border-radius: 5px;
`

const SwitchLink = styled.div<{ active: boolean }>`
    height: 20px;
    color: #fff;
    user-drag: none;
    & a {
        display: block;
        padding: 0 15px;
        color: #fff;
        text-decoration: none;
        user-drag: none;
    }
    background: ${({ active }) => (active ? brand : "initial")};
    line-height: 20px;
`

export const SwitchConnectView: React.FC = observer(function SwitchConnectView() {
    const { config } = useStores()
    const location = useLocation()
    const manual = location.pathname == locations.proposalsManualConnect
    const quick = location.pathname == locations.proposalsQuickConnect
    return (
        <Container>
            <SwitchGroup>
                <SwitchLink active={quick}>
                    {!quick ? (
                        <Link to={locations.proposalsQuickConnect} onClick={() => config.setQuickConnect(true)}>
                            Quick Connect
                        </Link>
                    ) : (
                        <a>Quick Connect</a>
                    )}
                </SwitchLink>
                <SwitchLink active={manual}>
                    {!manual ? (
                        <Link to={locations.proposalsManualConnect} onClick={() => config.setQuickConnect(false)}>
                            Manual Connect
                        </Link>
                    ) : (
                        <a>Manual Connect</a>
                    )}
                </SwitchLink>
            </SwitchGroup>
        </Container>
    )
})
