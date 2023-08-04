/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import toast, { Toast } from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"

const Container = styled.div`
    display: flex;
`

const Dismiss = styled.div`
    width: 22px;
    display: flex;
    align-items: start;
    justify-content: flex-end;
    font-size: 18px;
    color: #ccc;

    &:hover {
        color: #aaa;
    }
`
export const dismissibleToast = (message: JSX.Element | string | null): ((t: Toast) => JSX.Element) => {
    return function dismissibleToast(t: Toast): JSX.Element {
        return (
            <Container>
                <div>{message}</div>
                <Dismiss onClick={() => toast.dismiss(t.id)}>
                    <FontAwesomeIcon icon={faTimes} />
                </Dismiss>
            </Container>
        )
    }
}
