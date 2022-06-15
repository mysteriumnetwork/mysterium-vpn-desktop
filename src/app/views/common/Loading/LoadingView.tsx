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

import { bg1 } from "../../../ui-kit/colors"
import { Spinner } from "../../../ui-kit/components/Spinner/Spinner"

import animationLoadingStart from "./animation_loading_start.json"
import animationLoadingLoop from "./animation_loading_loop.json"

const Container = styled.div`
    background: ${bg1};
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    -webkit-app-region: drag;
    padding-top: 50px;
`

const Status = styled.div`
    margin-top: 50px;
    color: #fff;
`

export interface LoadingViewProps {
    status: string
}

export const LoadingView: React.FC<LoadingViewProps> = observer(({ status }) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const [anim, setAnim] = useState<{ src: object; loop: boolean; onComplete?: () => void }>({
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

            <Status>{status}</Status>
            <Spinner />
        </Container>
    )
})
