/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ButtonProps } from "@nodegui/react-nodegui/dist/components/Button/RNButton"

export interface CommonButtonProps extends ButtonProps {
    onClick: () => void
}
