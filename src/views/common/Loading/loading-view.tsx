/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"

import welcomeBg from "../../../ui-kit/assets/welcome-bg.png"
import { Spinner } from "../../../ui-kit/components/Spinner/Spinner"
import { useStores } from "../../../store"

const Container = styled.div`
    background: url(${welcomeBg}) no-repeat, #8e3061;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    -webkit-app-region: drag;
`

const StartupStatus = styled.div`
    color: #fff;
`

export const LoadingView: React.FC = observer(() => {
    const { daemon } = useStores()
    return (
        <Container>
            <div style={{ height: 40 }} />
            <Spinner />
            <StartupStatus>{daemon.startupStatus}</StartupStatus>
        </Container>
    )
})
