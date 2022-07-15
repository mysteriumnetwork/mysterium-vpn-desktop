/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as net from "net"
import { Socket } from "net"
import { platform } from "os"

import semver from "semver"
import { ipcMain } from "electron"
import { mysteriumSupervisorBin, nodeVersion } from "@mysteriumnetwork/node"

import { log } from "../../shared/log/log"
import { sudoExec } from "../../utils/sudo"
import { uid } from "../../utils/user"
import { MainIpcListenChannels } from "../../shared/ipc"

const isWin = platform() === "win32"

function mystSockPath(): string {
    if (isWin) {
        return "\\\\.\\pipe\\mystpipe"
    }
    return "/var/run/myst.sock"
}

const supervisorBin = (): string => {
    return mysteriumSupervisorBin(process.platform, process.arch).replace("app.asar", "app.asar.unpacked")
}

export class Supervisor {
    conn?: Socket

    registerIPC(): void {
        ipcMain.handle(MainIpcListenChannels.SupervisorConnect, () => this.connect())
        ipcMain.handle(MainIpcListenChannels.SupervisorInstall, () => this.install())
        ipcMain.handle(MainIpcListenChannels.SupervisorUpgrade, () => this.upgrade())
        ipcMain.handle(MainIpcListenChannels.SupervisorDisconnect, () => this.disconnect())
    }

    async connect(): Promise<void> {
        log.info("Connecting to the supervisor...")
        const mystSock = mystSockPath()
        return await new Promise((resolve, reject) => {
            this.conn = net
                .createConnection(mystSock)
                .on("connect", () => {
                    log.info("Connected to: ", mystSock)
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
                const message = data.toString().trim()

                if (!message.startsWith("ok")) {
                    reject(new Error(message.replace("error: ", "")))
                }

                if (message.startsWith("ok: ")) {
                    resolve(message.replace("ok: ", ""))
                } else {
                    resolve()
                }
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
        const bundledVersion = nodeVersion()

        let runningVersion = ""
        try {
            runningVersion = await this.runningVersion()
        } catch (err) {
            log.error("Error checking running version", err)
        }

        log.info("Supervisor version bundled:", bundledVersion, "running:", runningVersion)

        if (runningVersion == bundledVersion) {
            log.info("Running supervisor version matches, skipping the upgrade")
            return
        }
        if (!semver.valid(runningVersion) || !semver.valid(bundledVersion)) {
            log.info("Exotic versions of supervisor found, proceeding to upgrade")
        } else if (semver.gte(runningVersion, bundledVersion)) {
            log.info("Running supervisor version is compatible, skipping the upgrade")
            return
        }
        log.info(`Upgrading supervisor ${runningVersion} → ${bundledVersion}`)
        await supervisor.install()
    }

    async install(): Promise<void> {
        return await new Promise((resolve) => {
            sudoExec(`"${supervisorBin()}" -install -uid ${uid()}`)
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
}

export const supervisor = new Supervisor()
