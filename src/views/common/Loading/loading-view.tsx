/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import Lottie from "react-lottie-player"

import { useStores } from "../../../store"

import animationLoadingStart from "./animation_loading_start.json"
import animationLoadingLoop from "./animation_loading_loop.json"

const Container = styled.div`
    background: linear-gradient(180deg, #562160 0%, #7b2061 48.96%, #64205d 100%);
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
    const [anim, setAnim] = useState<{ src: unknown; loop: boolean; onComplete?: () => void }>({
        src: animationLoadingStart,
        loop: false,
        onComplete: () => {
            setAnim({
                src: animationLoadingLoop,
                loop: true,
            })
        },
    })
    return (
        <Container>
            <Lottie
                play
                loop={anim.loop}
                animationData={anim.src}
                onComplete={anim.onComplete}
                style={{ width: 250 }}
                renderer="svg"
            />
            <StartupStatus>{daemon.startupStatus}</StartupStatus>
        </Container>
    )
})
