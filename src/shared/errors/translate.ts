/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const errString = (err: unknown): string => {
    return err instanceof Error ? err.message : JSON.stringify(err)
}

const humanReadable = (msg: string): string => {
    if (msg.indexOf("peer error:") != -1) {
        return "Remote peer error"
    }
    if (msg.indexOf("status code 429") != -1) {
        return "Too many requests"
    }
    if (msg.indexOf("timeout of") != -1 && msg.indexOf("exceeded") != -1) {
        return "Connection timeout"
    }
    if (msg.indexOf("identity is offchain") != -1) {
        return "There seems to be a problem with your account. Please create a new identity to continue using MysteriumVPN."
    }
    return msg
}

export interface ParsedMessage {
    original: string
    humanReadable: string
}

export const parseError = (err: unknown): ParsedMessage => {
    const msg = errString(err)
    return {
        original: msg,
        humanReadable: humanReadable(msg),
    }
}
