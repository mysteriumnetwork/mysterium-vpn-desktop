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

const IP = styled.div`
    width: 100px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    user-select: text;
`

export const CurrentIP: React.FC<{ className?: string }> = observer(function CurrentIP({ className }) {
    const { connection } = useStores()
    return <IP className={className}>{connection.currentIp}</IP>
})
