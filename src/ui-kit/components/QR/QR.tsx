/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import styled from "styled-components"
import { QRCode } from "react-qr-svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFont, faQrcode } from "@fortawesome/free-solid-svg-icons"

import { userEvent } from "../../../analytics/analytics"
import { OtherAction } from "../../../analytics/actions"

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`

const Image = styled.div`
    margin: 0 auto;
`

const IconButton = styled.div`
    padding: 8px;
    border-radius: 6px;
    align-self: flex-end;
    &:hover {
        background: rgba(0, 0, 0, 0.15);
    }
`

const Content = styled.div`
    margin: 0 auto;
`

const Text = styled.code`
    user-select: text;
    font-size: 12px;
    line-height: 21px;
    overflow-wrap: anywhere;
`

export interface QRProps {
    text?: string
    height?: number
}

export const QR: React.FC<QRProps> = ({ text, height = 100 }) => {
    if (!text) {
        return <></>
    }
    const [imageView, setImageView] = useState(true)
    const toggleView = () => {
        const newVal = !imageView
        userEvent(OtherAction.ToggleQrView, String(newVal))
        setImageView(newVal)
    }
    const icon = imageView ? <FontAwesomeIcon icon={faFont} size="1x" /> : <FontAwesomeIcon icon={faQrcode} size="1x" />
    const content = imageView ? (
        <Image>
            <QRCode value={text} style={{ height }} />
        </Image>
    ) : (
        <Text>{text}</Text>
    )
    return (
        <Container>
            <IconButton onClick={toggleView}>{icon}</IconButton>
            <Content style={{ height }}>{content}</Content>
        </Container>
    )
}
