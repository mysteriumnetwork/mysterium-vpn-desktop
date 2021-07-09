/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { QRCode } from "react-qr-svg"

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`

const Image = styled.div`
    margin: 0 auto;
`

const Content = styled.div`
    margin: 0 auto;
`

export interface QRProps {
    text?: string
    height?: number
}

export const QR: React.FC<QRProps> = ({ text, height = 100 }) => {
    if (!text) {
        return <></>
    }
    return (
        <Container>
            <Content style={{ height }}>
                <Image>
                    <QRCode value={text} style={{ height }} />
                </Image>
            </Content>
        </Container>
    )
}
