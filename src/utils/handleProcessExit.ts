/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { log } from "../shared/log/log"

export const handleProcessExit = (): void => {
    const shutdown = (): void => {
        log.info("Shutting down...")
        process.exit(0)
    }
    process.on("beforeExit", shutdown)
    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)
    process.on("SIGUSR1", shutdown)
    process.on("SIGUSR2", shutdown)
    process.on("uncaughtException", (err) => {
        log.error(new Date().toUTCString() + " uncaughtException:", err.message)
        log.error(err.stack)
        process.exit(1)
    })
}
