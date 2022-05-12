/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { FormEventHandler, PropsWithChildren } from "react"
import styled from "styled-components"

import { OutlineButton } from "../Button/OutlineButton"
import { darkBlue } from "../../colors"
import { Heading2 } from "../../typography"
import { BrandButton } from "../Button/BrandButton"

const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
`

const Box = styled.div`
    box-sizing: border-box;
    width: 320px;
    background: #fff;
    color: ${darkBlue};

    padding: 15px;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
`

const PromptTitle = styled(Heading2)`
    text-align: center;
    margin-bottom: 15px;
`

const PromptButtons = styled.div`
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    & > button {
        width: 140px;
    }
`

const PromptButtonOK = styled(BrandButton)`
    box-shadow: none;
`

export interface PromptProps {
    visible: boolean
    title?: string
    onSubmit?: () => void
    onCancel?: () => void
    submitText?: string
}

export const Prompt: React.FC<PropsWithChildren<PromptProps>> = ({
    visible,
    title,
    onSubmit,
    onCancel,
    submitText = "OK",
    children,
}) => {
    if (!visible) {
        return <></>
    }
    const handleOnSubmit: FormEventHandler = (evt) => {
        evt.preventDefault()
        onSubmit?.()
    }
    const handleCancel = () => {
        onCancel?.()
    }
    return (
        <Background>
            <Box>
                <form onSubmit={handleOnSubmit}>
                    <PromptTitle>{title}</PromptTitle>
                    {children}
                    <PromptButtons>
                        <PromptButtonOK type="submit">{submitText}</PromptButtonOK>
                        <OutlineButton onClick={handleCancel} type="button">
                            Cancel
                        </OutlineButton>
                    </PromptButtons>
                </form>
            </Box>
        </Background>
    )
}
