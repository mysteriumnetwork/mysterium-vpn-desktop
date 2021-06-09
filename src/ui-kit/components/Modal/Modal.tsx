/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { PropsWithChildren } from "react"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

import { titleBarSize } from "../../../config"

const BackgroundBlur = styled.div`
    position: fixed;
    top: ${titleBarSize.height}px;
    height: 511px;
    width: 640px;
    overflow: hidden;
    z-index: -1;

    &.enter-active,
    &.enter-done,
    &.exit-active {
        z-index: 1;
        background: rgba(255, 255, 255, 0.7);
    }
`

const CloseButton = styled.div`
    margin-left: auto;
    cursor: pointer;
`

const Header = styled.div`
    display: flex;
    padding: 12px;
    font-weight: bold;
    border-bottom: 1px solid #d9d9d9;
`

const Content = styled.div`
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.3);
    position: relative;
    width: 60%;
    height: 64%;
    left: 20%;
    top: 18%;
    background: #fff;
    opacity: 0;
    z-index: 0;
    display: flex;
    flex-direction: column;

    .enter-active &,
    .enter-done & {
        opacity: 1;
        z-index: 0;
    }
    .exit-active & {
        opacity: 0;
    }
    .exit-done & {
        opacity: 0;
        z-index: -1;
    }

    .icon {
        visibility: hidden;
    }
    .enter-done & {
        .icon {
            visibility: visible;
        }
    }
`

export interface ModalProps {
    title: string
    visible: boolean
    onClose: () => void
}

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ title, visible, onClose, children }) => {
    return (
        <CSSTransition in={visible} timeout={0}>
            <BackgroundBlur>
                <Content>
                    <Header>
                        {title}
                        <CloseButton onClick={onClose}>
                            <FontAwesomeIcon className="icon" icon={faTimes} color="#404040" size="lg" />
                        </CloseButton>
                    </Header>
                    {children}
                </Content>
            </BackgroundBlur>
        </CSSTransition>
    )
}
