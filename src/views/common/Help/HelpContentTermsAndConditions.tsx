/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"

import { Heading2 } from "../../../ui-kit/typography"

const Title = styled(Heading2)`
    margin: 15px 0;
`

export const HelpContentTermsAndConditions: React.FC = observer(() => {
    return (
        <>
            <Title>Terms & Conditions</Title>
        </>
    )
})
