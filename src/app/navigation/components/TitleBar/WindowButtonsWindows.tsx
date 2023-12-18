/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { ipcRenderer } from "electron"

import { MainIpcListenChannels } from "../../../../shared/ipc"

const Container = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`

const Button = styled.div`
    width: 46px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    user-select: none;
    -webkit-app-region: no-drag;

    fill: #fff;
    &:hover {
        background: #aeaedb33;
    }
    &:active {
        background: rgba(0, 0, 0, 0.3);
    }
`

export const WindowButtonsWindows: React.FC = () => {
    return (
        <Container>
            <Button onClick={() => ipcRenderer.send(MainIpcListenChannels.MinimizeWindow)}>
                <svg width="11" height="1" viewBox="0 0 11 1">
                    <path d="m11 0v1h-11v-1z" strokeWidth=".26208" />
                </svg>
            </Button>
            <Button onClick={() => ipcRenderer.send(MainIpcListenChannels.CloseWindow)}>
                <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                        d="m6.8496 6 5.1504 5.1504-0.84961 0.84961-5.1504-5.1504-5.1504 5.1504-0.84961-0.84961 5.1504-5.1504-5.1504-5.1504 0.84961-0.84961 5.1504 5.1504 5.1504-5.1504 0.84961 0.84961z"
                        strokeWidth=".3"
                    />
                </svg>
            </Button>
        </Container>
    )
}
