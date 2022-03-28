/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { APIError } from "mysterium-vpn-js"

export interface ParsedMessage {
    original: string
    humanReadable: string
}

export const parseError = (err: unknown): ParsedMessage => {
    if (err instanceof APIError) {
        return {
            original: JSON.stringify(err.response),
            humanReadable: err.human(),
        }
    }
    const msg = err instanceof Error ? err.message : JSON.stringify(err)
    return {
        original: msg,
        humanReadable: msg,
    }
}
