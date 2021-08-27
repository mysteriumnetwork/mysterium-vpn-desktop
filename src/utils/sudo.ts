/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as os from "os"
import { execFileSync } from "child_process"

import { exec } from "sudo-prompt"
import semver from "semver"

import * as packageJson from "../../package.json"
import { log } from "../shared/log/log"

import { staticAssetPath } from "./paths"

export const sudoExec = (cmd: string): void => {
    if (os.platform() === "darwin" && semver.gte(os.release(), "19.0.0")) {
        // >= macOS Catalina
        catalinaSudoExec(cmd)
        return
    }
    exec(
        cmd,
        {
            name: packageJson.productName,
            icns: staticAssetPath("logo.icns"),
        },
        (error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => {
            log.info("[sudo-exec]", stdout, stderr)
            if (error) {
                log.error("[sudo-exec] error:", error)
            }
        },
    )
}

const catalinaSudoExec = (cmd: string) => {
    execFileSync("sudo", ["--askpass", "sh", "-c", cmd], {
        encoding: "utf8",
        env: {
            PATH: process.env.PATH,
            SUDO_ASKPASS: staticAssetPath("sudo-askpass.osascript.js"),
        },
    })
}
