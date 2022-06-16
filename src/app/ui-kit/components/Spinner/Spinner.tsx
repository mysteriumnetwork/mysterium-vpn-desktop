/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import Lottie from "react-lottie-player"
import styled from "styled-components"

import animationSpinner from "./animation_spinner.json"

export interface SpinnerProps {
    className?: string
}

const Container = styled.div`
    width: 80px;
`

export const Spinner: React.FC<SpinnerProps> = ({ className }) => (
    <Container className={className}>
        <Lottie play loop animationData={animationSpinner} renderer="svg" speed={1.25} />
    </Container>
)
