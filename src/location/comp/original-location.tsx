/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { useStores } from "../../store"

import { Flag } from "./Flag/Flag"

const Container = styled.div`
    box-sizing: border-box;
    height: 72px;
    background: #fafafa;
    box-shadow: inset 0 1px 1px #e6e6e6;
    display: flex;
    align-items: center;
`

const ConnectionStatus = styled.p`
    font-weight: bold;
`

const LocationFlag = styled(Flag)`
    padding: 16px;
`

const Location = styled.div`
    p {
        margin: 0;
        line-height: 20px;
    }
`

export const OriginalLocation = observer(() => {
    const { connection } = useStores()
    const ip = `IP: ${connection.originalLocation?.ip ?? "Unknown"}`
    return (
        <Container>
            <LocationFlag countryCode={connection.originalLocation?.country} />
            <Location>
                <ConnectionStatus>{connection.status}</ConnectionStatus>
                <p>{ip}</p>
            </Location>
        </Container>
    )
})
