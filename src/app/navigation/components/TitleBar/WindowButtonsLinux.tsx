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
    width: 24px;
    height: 24px;
    border-radius: 24px;
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

export const WindowButtonsLinux: React.FC = () => {
    return (
        <Container>
            <Button onClick={() => ipcRenderer.send(MainIpcListenChannels.MinimizeWindow)} style={{ marginRight: 16 }}>
                <svg width="24" height="24" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0 -1036.4)">
                        <rect id="rect4834" x="4" y="1044.4" width="8" height="1" fill="#3c3857" />
                    </g>
                </svg>
            </Button>
            <Button onClick={() => ipcRenderer.send(MainIpcListenChannels.CloseWindow)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" version="1.1">
                    <g transform="translate(0,-1036.3621)">
                        <path
                            d="m 10.299805,1041.3553 -0.3535201,0.3535 -4.5996095,4.5996 -0.35351,0.3535 0.70703,0.7071 0.35352,-0.3535 4.5996096,-4.5996 0.35351,-0.3536 -0.70703,-0.707 z"
                            id="path4535"
                            fill="#3c3857"
                        />
                        <path
                            d="m 5.7001954,1041.3553 -0.70703,0.707 0.35351,0.3536 4.5996095,4.5996 0.3535201,0.3535 0.70703,-0.7071 -0.35351,-0.3535 -4.5996096,-4.5996 -0.35352,-0.3535 z"
                            id="path4537"
                            fill="#3c3857"
                        />
                    </g>
                </svg>
            </Button>
        </Container>
    )
}
