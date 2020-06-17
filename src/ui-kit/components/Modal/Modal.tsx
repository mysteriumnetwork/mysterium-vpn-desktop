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

const Container = styled.div`
    position: absolute;
    top: 40px;
    height: 512px;
    width: 100%;
    overflow: hidden;
    z-index: -1;

    &.enter-active,
    &.enter-done,
    &.exit-active {
        z-index: 1;
    }
`

const CloseButton = styled.div`
    position: fixed;
    right: 0;
    padding: 16px;
    cursor: pointer;
`

const Content = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    top: -500px;
    opacity: 0;
    z-index: 0;

    transition: all 0.3s ease-in-out;

    .enter-active &,
    .enter-done & {
        top: 0;
        opacity: 1;
        z-index: 0;
    }
    .exit-active & {
        top: -500px;
        opacity: 0;
    }
    .exit-done & {
        top: -500px;
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
    visible: boolean
    light?: boolean
    onClose: () => void
}

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ light = false, visible, onClose, children }) => {
    const closeIconColor = light ? "#404040" : "#fff"
    return (
        <CSSTransition in={visible} timeout={300}>
            <Container>
                <Content>
                    <CloseButton onClick={onClose}>
                        <FontAwesomeIcon className="icon" icon={faTimes} color={closeIconColor} size="lg" />
                    </CloseButton>
                    {children}
                </Content>
            </Container>
        </CSSTransition>
    )
}
