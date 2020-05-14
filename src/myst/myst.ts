/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { execFile, ChildProcess } from "child_process"

import { staticAssetPath } from "../utils/paths"

let mystProcess: ChildProcess | null

export function startMyst(): Promise<void> {
    if (mystProcess) {
        return Promise.reject("myst process already started")
    }

    const mystPath = staticAssetPath("myst")
    const defaults = {
        cwd: undefined,
        env: process.env,
    }

    mystProcess = execFile(
        mystPath,
        ["--mymysterium.enabled=false", "--ui.enable=false", "--usermode", "daemon"],
        defaults,
    )

    mystProcess.on("close", (code) => {
        console.log(`myst process exited with code ${code}`)
    })

    return Promise.resolve()
}

export function killMyst(): void {
    if (mystProcess) {
        mystProcess.kill("SIGTERM")
        mystProcess = null
    }
}
