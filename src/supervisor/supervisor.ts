/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as net from "net"
import { Socket } from "net"
import { platform } from "os"
import { spawn } from "child_process"

import semver from "semver"

import { staticAssetPath } from "../utils/paths"
import { analytics } from "../analytics/analytics-main"
import { AppAction, Category } from "../analytics/analytics"
import { log } from "../log/log"
import { sudoExec } from "../utils/sudo"
import { uid } from "../utils/user"

const isWin = platform() === "win32"

function mystSockPath(): string {
    if (isWin) {
        return "\\\\.\\pipe\\mystpipe"
    }
    return "/var/run/myst.sock"
}

export class Supervisor {
    conn?: Socket

    async connect(): Promise<void> {
        log.info("Connecting to the supervisor...")
        const mystSock = mystSockPath()
        return await new Promise((resolve, reject) => {
            this.conn = net
                .createConnection(mystSock)
                .on("connect", () => {
                    log.info("Connected to: ", mystSock)
                    analytics.event(Category.App, AppAction.ConnectedToSupervisor)
                    return resolve()
                })
                .on("data", (data: Buffer) => {
                    log.info("Server:", data.toString())
                })
                .on("error", function (data) {
                    return reject(data)
                })
        })
    }

    async bundledVersion(): Promise<string> {
        const supervisor = spawn(this.supervisorBin(), ["-version"])
        let stdout = ""
        supervisor.stdout.on("data", (data) => {
            log.debug("Supervisor stdout:", data.toString())
            stdout = data.toString()
        })
        supervisor.stderr.on("data", (data) => {
            log.error("Supervisor stderr:", data.toString())
        })
        return new Promise((resolve, reject) => {
            supervisor.on("error", reject)
            supervisor.on("exit", (code) => {
                if (code === 0) {
                    resolve(stdout)
                } else {
                    reject(new Error(`exit code: ${code}`))
                }
            })
        })
    }

    /**
     * Sends command to the supervisor and returns the response.
     */
    request(command: string, timeout = 2000): Promise<string | void> {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-const
            let timer: NodeJS.Timeout
            this.conn?.write(command + "\n")
            const responseHandler = (data: Buffer) => {
                clearTimeout(timer)
                const message = data.toString()
                if (!message.startsWith("ok: ")) {
                    reject(new Error(message.replace("error: ", "")))
                }
                const payload = message.replace("ok: ", "")
                resolve(payload)
            }
            this.conn?.once("data", responseHandler)
            timer = setTimeout(() => {
                reject(new Error("timed out waiting for response"))
                this.conn?.removeListener("data", responseHandler)
            }, timeout)
        })
    }

    runningVersion(): Promise<string> {
        return this.request("version") as Promise<string>
    }

    async upgrade(): Promise<void> {
        let bundledVersion = ""
        try {
            bundledVersion = await this.bundledVersion()
            log.info("Bundled supervisor version:", bundledVersion)
        } catch (err) {
            log.error("Error checking bundled version", err)
        }

        let runningVersion = ""
        try {
            runningVersion = await this.runningVersion()
            log.info("Running supervisor version:", runningVersion)
        } catch (err) {
            log.error("Error checking running version", err)
        }

        if (!semver.valid(runningVersion) || !semver.valid(bundledVersion)) {
            log.info(
                "Exotic versions of supervisor found, not performing the upgrade. Upgrade manually if needed:\n" +
                    "sudo myst_supervisor -install -uid ...",
            )
            return
        }
        if (semver.gte(runningVersion, bundledVersion)) {
            log.info("Running supervisor version is compatible, skipping the upgrade")
            return
        }
        log.info(`Upgrading supervisor ${runningVersion} → ${bundledVersion}`)
        return supervisor.install()
    }

    supervisorBin(): string {
        let supervisorBinaryName = "bin/myst_supervisor"
        if (isWin) {
            supervisorBinaryName += ".exe"
        }
        return staticAssetPath(supervisorBinaryName)
    }

    async install(): Promise<void> {
        analytics.event(Category.App, AppAction.InstallSupervisor)
        return await new Promise((resolve) => {
            sudoExec(`"${this.supervisorBin()}" -install -uid ${uid()}`)
            const waitUntilConnected = (): void => {
                this.connect()
                    .then(() => resolve())
                    .catch(() => setTimeout(waitUntilConnected, 500))
            }
            setTimeout(waitUntilConnected, 500)
        })
    }

    disconnect(): void {
        if (this.conn) {
            this.conn.destroy()
        }
    }

    killMyst(): void {
        if (!this.conn) {
            throw new Error("Supervisor is not connected")
        }
        this.conn.write("kill\n")
    }

    // Myst process is not started from supervisor as supervisor runs as root user
    // which complicates starting myst process as non root user.
    startMyst(): Promise<void> {
        let mystBinaryName = "bin/myst"
        if (isWin) {
            mystBinaryName += ".exe"
        }
        const mystPath = staticAssetPath(mystBinaryName)
        const mystProcess = spawn(
            mystPath,
            ["--mymysterium.enabled=false", "--ui.enable=false", "--usermode", "--consumer", "daemon"],
            {
                detached: true, // Needed for unref to work correctly.
                stdio: "ignore", // Needed for unref to work correctly.
            },
        )

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

export const supervisor = new Supervisor()
