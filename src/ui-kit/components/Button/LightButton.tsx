/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import styled from "styled-components"

import { BrandButton } from "./BrandButton"
import { ButtonProps } from "./ButtonProps"

export const LightButton = styled(BrandButton)`
    background: ${(props: ButtonProps): string => (props.disabled ? "#ccc" : "#fefefe")};
    color: ${(props: ButtonProps): string => (props.disabled ? "#fff" : "#333")};
`
