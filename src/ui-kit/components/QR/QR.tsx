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
    margin: 0 auto;
`

const Image = styled.div`
    flex: 0;
    height: 120px;
    width: 120px;
    margin: 0 auto;
`

const TextPart = styled.div`
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const Text = styled.code`
    user-select: text;
    font-size: 12px;
    line-height: 21px;
    overflow-wrap: anywhere;
`

const Copy = styled.button`
    margin-left: 12px;
`

export interface QRProps {
    text?: string
    copyButton?: boolean
}

export const QR: React.FC<QRProps> = ({ text, copyButton = false }) => {
    if (!text) {
        return <></>
    }
    const copyText = (): void => {
        navigator.clipboard.writeText(text)
    }
    return (
        <Container>
            <Image>
                <QRCode value={text} style={{ width: 120 }} />
            </Image>
            <TextPart>
                <Text>{text}</Text>
                {copyButton && (
                    <div>
                        <Copy onClick={copyText}>Copy</Copy>
                    </div>
                )}
            </TextPart>
        </Container>
    )
}
