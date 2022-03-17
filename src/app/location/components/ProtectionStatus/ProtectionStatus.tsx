/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"

import { useStores } from "../../../store"
import { brand } from "../../../ui-kit/colors"
import { connectionActive } from "../../../connection/status"

const Status = styled.div<{ isProtected: boolean }>`
    box-sizing: border-box;
    width: 80px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 18px;
    padding: 0 7px;
    color: ${(props) => (props.isProtected ? "#fff" : brand)};
    background: ${(props) => (props.isProtected ? "#58c800" : "inherit")};
`

export const ProtectionStatus = observer(function ProtectionStatus() {
    const { connection } = useStores()
    const isProtected = connectionActive(connection.status)
    return <Status isProtected={isProtected}>{isProtected ? "Protected" : "Unprotected"}</Status>
})
