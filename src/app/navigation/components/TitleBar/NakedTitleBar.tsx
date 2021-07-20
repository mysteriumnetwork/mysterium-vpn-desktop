/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { remote } from "electron"
import styled from "styled-components"

import { WindowButtonsWindows } from "./WindowButtonsWindows"
import { WindowButtonsLinux } from "./WindowButtonsLinux"
import { Container as TitlebarContainer } from "./TitleBar"

const Container = styled(TitlebarContainer)`
    justify-content: flex-end;
`

export const NakedTitleBar: React.FC = () => {
    const isWindows = remote.getGlobal("os") === "win32"
    const isLinux = remote.getGlobal("os") !== "darwin" && !isWindows
    return (
        <Container>
            {isWindows && <WindowButtonsWindows />}
            {isLinux && <WindowButtonsLinux />}
        </Container>
    )
}
