/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { darkBlue } from "../../../ui-kit/colors"

export const ViewSidebar = styled.div`
    height: 100%;
    width: 222px;
    min-width: 222px;
    margin-right: 10px;
    border-radius: 10px;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    background: #f8f8fd;
    color: ${darkBlue};
`
