/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react"
import styled from "styled-components"

import * as packageJson from "../../../../package.json"
import { Small } from "../../ui-kit/typography"

const Container = styled(Small)`
    opacity: 0.5;
    text-align: center;
`

export const AppVersion: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <Container className={className}>
            App version:
            <br />
            {packageJson.version}
        </Container>
    )
}
