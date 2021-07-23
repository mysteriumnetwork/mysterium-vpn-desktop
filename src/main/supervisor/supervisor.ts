/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as net from "net"
import { Socket } from "net"
import { platform } from "os"
import { ChildProcess, spawn } from "child_process"

import semver from "semver"
import { NodeHealthcheck, TequilapiClientFactory } from "mysterium-vpn-js"

import * as packageJson from "../../../package.json"
import { staticAssetPath } from "../../utils/paths"
import { log } from "../../shared/log/log"
import { sudoExec } from "../../utils/sudo"
import { uid } from "../../utils/user"
import { webAnalyticsAppStateEvent } from "../analytics-main"
import { AppStateAction } from "../../shared/analytics/actions"
import { ImportIdentityOpts, SupervisorInterface } from "../../shared/supervisor"
import { TEQUILAPI_PORT } from "../../app/tequilapi"
import { IpcResponse } from "../../shared/ipc"

const isWin = platform() === "win32"

function mystSockPath(): string {
    if (isWin) {
        return "\\\\.\\pipe\\mystpipe"
    }
    return "/var/run/myst.sock"
}

export class Supervisor implements SupervisorInterface {
    conn?: Socket
    proc?: ChildProcess
    port?: number

    async connect(): Promise<void> {
        log.info("Connecting to the supervisor...")
        const mystSock = mystSockPath()
        return await new Promise((resolve, reject) => {
            this.conn = net
                .createConnection(mystSock)
                .on("connect", () => {
                    log.info("Connected to: ", mystSock)
                    webAnalyticsAppStateEvent(AppStateAction.SupervisorConnected)
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

    setSupervisorTequilapiPort(port: number): Promise<string> {
        log.info(`myst supervisor tequilapi port set to: ${port}`)
        return this.request(`ta-set-port ${port}`) as Promise<string>
    }

    async upgrade(): Promise<void> {
        const bundledVersion = packageJson.dependencies["@mysteriumnetwork/node"]

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

    supervisorBin(): string {
        let supervisorBinaryName = "bin/myst_supervisor"
        if (isWin) {
            supervisorBinaryName += ".exe"
        }
        return staticAssetPath(supervisorBinaryName)
    }

    async install(): Promise<void> {
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

    async killGhost(port: number): Promise<void> {
        const api = new TequilapiClientFactory(`http://127.0.0.1:${port}`, 3_000).build()
        let hc: NodeHealthcheck | undefined
        try {
            hc = await api.healthCheck(100)
        } catch (err) {
            log.info("No ghosts found on port", port)
        }
        if (!hc?.process) {
            return
        }
        log.info("Found a ghost node on port", port, "PID", hc.process)
        log.info("Attempting to shutdown gracefully")
        try {
            await api.stop()
            return
        } catch (err) {
            log.info("Could not stop node on", port, err.message)
        }
        log.info("Attempting to kill process", hc.process)
        try {
            process.kill(hc.process)
        } catch (err) {
            log.info("Could not kill process", hc.process, err)
        }
    }

    mystBin(): string {
        let mystBinaryName = "bin/myst"
        if (isWin) {
            mystBinaryName += ".exe"
        }
        return staticAssetPath(mystBinaryName)
    }

    // Myst process is not started from supervisor as supervisor runs as root user
    // which complicates starting myst process as non root user.
    startMyst(port: number): Promise<void> {
        this.setSupervisorTequilapiPort(port)
        this.port = port

        const mystProcess = spawn(
            this.mystBin(),
            [
                "--ui.enable=false",
                "--testnet2",
                "--usermode",
                "--consumer",
                `--tequilapi.port=${port}`,
                "--discovery.type=api",
                "daemon",
            ],
            {
                stdio: "ignore", // Needed for unref to work correctly.
            },
        )

        mystProcess.stdout?.on("data", (d) => {
            log.info(d)
        })

        this.proc = mystProcess

        mystProcess.on("close", (code) => {
            log.info(`myst process exited with code ${code}`)
        })

        return Promise.resolve()
    }

    exportIdentity({
        id,
        filename,
        passphrase,
    }: {
        id: string
        filename: string
        passphrase: string
    }): Promise<IpcResponse> {
        return new Promise((resolve, reject) => {
            const cli = spawn(
                this.mystBin(),
                [
                    "cli",
                    "--agreed-terms-and-conditions",
                    `--tequilapi.port=${TEQUILAPI_PORT}`,
                    "identities",
                    "export",
                    id,
                    passphrase,
                    filename,
                ],
                { stdio: "inherit" },
            )
            cli.on("exit", (code) => {
                if (code == 0) {
                    return resolve({
                        result: filename,
                    })
                } else {
                    return reject({
                        error: "Failed with status: " + code,
                    })
                }
            })
        })
    }

    importIdentity({ filename, passphrase }: ImportIdentityOpts): Promise<IpcResponse> {
        return new Promise((resolve, reject) => {
            const cli = spawn(
                this.mystBin(),
                [
                    "cli",
                    "--agreed-terms-and-conditions",
                    `--tequilapi.port=${TEQUILAPI_PORT}`,
                    "identities",
                    "import",
                    passphrase,
                    filename,
                ],
                { stdio: "inherit" },
            )
            cli.on("exit", (code) => {
                if (code == 0) {
                    return resolve({
                        result: filename,
                    })
                } else {
                    return reject({
                        error: "Failed with status: " + code,
                    })
                }
            })
        })
    }

    async stopMyst(): Promise<void> {
        log.info("Stopping myst")
        if (this.port) {
            log.info("Shutting down node gracefully on port", this.port)
            const api = new TequilapiClientFactory(`http://127.0.0.1:${this.port}`, 3_000).build()
            try {
                await api.stop()
                return
            } catch (err) {
                log.error("Could not shutdown myst gracefully", err.message)
            }
        }
        if (this.proc) {
            log.info("Killing node process", this.proc.pid)
            try {
                this.proc.kill()
            } catch (err) {
                log.error("Could not kill node process", err.message)
            }
        }
    }
}

export const supervisor = new Supervisor()
