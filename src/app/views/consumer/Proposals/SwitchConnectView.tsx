/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

import { useStores } from "../../../store"
import { locations } from "../../../navigation/locations"
import { brand } from "../../../ui-kit/colors"

const Container = styled.div`
    width: 378px;
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

export const SwitchConnectView: React.FC = observer(() => {
    const { router, config } = useStores()
    const manual = router.location.pathname == locations.proposalsManualConnect
    const smart = router.location.pathname == locations.proposalsSmartConnect
    return (
        <Container>
            <SwitchGroup>
                <SwitchLink active={smart}>
                    {!smart ? (
                        <Link to={locations.proposalsSmartConnect} onClick={() => config.setSmartConnect(true)}>
                            Smart Connect
                        </Link>
                    ) : (
                        <a>Smart Connect</a>
                    )}
                </SwitchLink>
                <SwitchLink active={manual}>
                    {!manual ? (
                        <Link to={locations.proposalsManualConnect} onClick={() => config.setSmartConnect(false)}>
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
