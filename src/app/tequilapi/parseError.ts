/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { TequilapiError } from "mysterium-vpn-js"

export const parseError = (error: unknown): string | undefined => {
    if (error instanceof TequilapiError) {
        const tequilaError = error as TequilapiError
        const responseData = tequilaError.originalResponseData
        return responseData?.message
    }
    return
}
