/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { brand, darkBlue, lightBlue } from "../../colors"

import { BrandButton } from "./BrandButton"

export const PrimarySidebarActionButton = styled(BrandButton).attrs({
    background: `${brand}11`,
    color: brand,
})`
    border-radius: 10px;
    box-shadow: none;
    flex: 1;
`

export const SecondarySidebarActionButton = styled(BrandButton).attrs({
    background: lightBlue,
    color: darkBlue,
})`
    border-radius: 10px;
    box-shadow: none;
    flex: 1;
    &:enabled:hover {
        filter: brightness(98%);
    }
    margin-top: 20px;
`

export const ButtonContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const ButtonIcon = styled.div`
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    background: #00000005;
    border-radius: 25px;
    margin-bottom: 10px;
`
