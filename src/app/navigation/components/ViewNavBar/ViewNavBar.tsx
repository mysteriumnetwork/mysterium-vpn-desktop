/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { PropsWithChildren } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"

import { LogoTitle } from "../../../ui-kit/components/LogoTitle/LogoTitle"
import { Heading2 } from "../../../ui-kit/typography"

const Container = styled.div`
    box-sizing: border-box;
    height: 58px;
    min-height: 58px;
    max-height: 58px;
    padding: 0 15px;

    display: grid;
    grid-template-columns: 222px 378px;
    column-gap: 10px;
    align-items: center;
`

const BackContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #ffffffcc;
    &:hover {
        color: #fff;
    }
`

const BackIcon = styled(FontAwesomeIcon)`
    margin-right: 10px;
`

export interface ViewNavBarProps {
    onBack?: () => void
}

export const ViewNavBar: React.FC<PropsWithChildren<ViewNavBarProps>> = ({ onBack, children }) => (
    <Container>
        {onBack && (
            <BackContainer onClick={onBack}>
                <BackIcon icon={faArrowCircleLeft} size="2x" />
                <Heading2>Back</Heading2>
            </BackContainer>
        )}
        {!onBack && <LogoTitle />}
        {children}
    </Container>
)
