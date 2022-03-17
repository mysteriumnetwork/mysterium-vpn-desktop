/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"

import { WindowButtonsWindows } from "./WindowButtonsWindows"
import { WindowButtonsLinux } from "./WindowButtonsLinux"
import { Container as TitlebarContainer } from "./TitleBar"

const Container = styled(TitlebarContainer)`
    justify-content: flex-end;
`

export const NakedTitleBar: React.FC = observer(function NakedTitleBar() {
    const root = useStores()
    return (
        <Container>
            {root.isWindows && <WindowButtonsWindows />}
            {root.isLinux && <WindowButtonsLinux />}
        </Container>
    )
})
