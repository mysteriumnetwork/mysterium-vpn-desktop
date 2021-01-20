/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { spawn } from "child_process"

import { staticAssetPath } from "../utils/paths"
import { log } from "../log/log"

import { Supervisor } from "./index"

export class LinuxSupervisor implements Supervisor {
    async connect(): Promise<void> {
        log.info("Connecting to the Linux NOOP supervisor...")
        return Promise.resolve()
    }

    async upgrade(): Promise<void> {
        return Promise.resolve()
    }

    async install(): Promise<void> {
        return Promise.resolve()
    }

    killMyst(): void {
        return
    }

    // Myst process is not started from supervisor as supervisor runs as root user
    // which complicates starting myst process as non root user.
    startMyst(): Promise<void> {
        const mystProcess = spawn(staticAssetPath("bin/myst"), ["--ui.enable=false", "--testnet2", "daemon"], {
            detached: true, // Needed for unref to work correctly.
            stdio: "ignore", // Needed for unref to work correctly.
        })

        // Unreference myst node process from main electron process which allow myst to run
        // independenly event after app is force closed. This allows supervisor to finish
        // node shutdown gracefully.
        mystProcess.unref()

        mystProcess.on("close", (code) => {
            log.info(`myst process exited with code ${code}`)
        })

        return Promise.resolve()
    }
}
