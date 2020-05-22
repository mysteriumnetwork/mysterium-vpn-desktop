/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { textCaption } from "../../../ui-kit/typography"

export const Header = styled.div`
    box-sizing: border-box;
    height: 32px;
    min-height: 32px;
    flex: 0;
    margin: 8px 0;
    padding: 0 24px;
    font-size: 12px;
    color: #666;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.2);
    ${textCaption}
`
