/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import electronLog from "electron-log"

import { ParsedMessage } from "../errors/parseError"

electronLog.transports.console.level = "debug"
electronLog.transports.file.level = "debug"

export const log = electronLog
export const logErrorMessage = (caption: string, err: ParsedMessage): void => {
    log.error(`${caption}: ${err.humanReadable}\nOriginal message: ${err.original}`)
}
