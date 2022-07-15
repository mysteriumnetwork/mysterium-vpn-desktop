/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ChildProcess } from "child_process"

import { NodeHealthcheck, TequilapiClientFactory } from "mysterium-vpn-js"
import { BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent } from "electron"
import { mysteriumNodeBin } from "@mysteriumnetwork/node"

import { spawnProcess } from "../../utils/spawn"
import { log, logErrorMessage } from "../../shared/log/log"
import { TEQUILAPI_PORT } from "../../app/tequilapi"
import { IpcResponse, MainIpcListenChannels } from "../../shared/ipc"
import { isProduction } from "../../utils/env"
import { ExportIdentityOpts, ImportIdentityOpts } from "../../shared/node/mysteriumNodeIPC"
import { parseError } from "../../shared/errors/parseError"

const mystBin = (): string => {
    return mysteriumNodeBin(process.platform, process.arch).replace("app.asar", "app.asar.unpacked")
}

const parseCLIError = (message: string): string => {
    let idx = message.indexOf("Possible error: ")
    if (idx != -1) {
        return message.substring(idx)
    }
    idx = message.indexOf("reason: ")
    if (idx != -1) {
        return message.substring(idx)
    }
    return message
}

export class MysteriumNode {
    port?: number
    proc?: ChildProcess

    registerIPC(getMainWindow: () => BrowserWindow | null): void {
        ipcMain.handle(MainIpcListenChannels.StartNode, () => {
            return this.start()
        })
        ipcMain.handle(MainIpcListenChannels.StopNode, () => {
            return this.stop()
        })
        ipcMain.handle(MainIpcListenChannels.KillGhosts, async () => {
            if (isProduction()) {
                await Promise.all([this.killGhost(4050), this.killGhost(44050)])
            }
        })
        ipcMain.handle(
            MainIpcListenChannels.ImportIdentity,
            async (event: IpcMainInvokeEvent, opts: ImportIdentityOpts): Promise<IpcResponse> => {
                return this.importIdentity(opts)
            },
        )
        ipcMain.handle(MainIpcListenChannels.ImportIdentityChooseFile, async (): Promise<IpcResponse> => {
            const mainWindow = getMainWindow()
            if (!mainWindow) {
                return {}
            }
            const filename = dialog
                .showOpenDialogSync(mainWindow, {
                    filters: [{ extensions: ["json"], name: "keystore" }],
                })
                ?.find(Boolean)
            return Promise.resolve({ result: filename })
        })
        ipcMain.handle(
            MainIpcListenChannels.ExportIdentity,
            async (event: IpcMainInvokeEvent, opts: ExportIdentityOpts): Promise<IpcResponse> => {
                const mainWindow = getMainWindow()
                if (!mainWindow) {
                    return {}
                }
                const filename = dialog.showSaveDialogSync(mainWindow, {
                    filters: [{ extensions: ["json"], name: "keystore" }],
                    defaultPath: `${opts.id}.json`,
                })
                if (!filename) {
                    return {}
                }
                return await this.exportIdentity({ id: opts.id, filename: filename, passphrase: opts.passphrase })
            },
        )
    }

    // Myst process is not started from supervisor as supervisor runs as root user
    // which complicates starting myst process as non root user.
    start(port = TEQUILAPI_PORT): Promise<void> {
        this.port = port

        const mystProcess = spawnProcess(
            mystBin(),
            [
                "--ui.enable=false",
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
            const msg = parseError(err)
            logErrorMessage("Could not stop node on port " + port, msg)
        }
        log.info("Attempting to kill process", hc.process)
        try {
            process.kill(hc.process)
        } catch (err) {
            const msg = parseError(err)
            logErrorMessage("Could not kill process PID " + hc.process, msg)
        }
    }

    async stop(): Promise<void> {
        log.info("Stopping myst")
        if (this.port) {
            log.info("Shutting down node gracefully on port", this.port)
            const api = new TequilapiClientFactory(`http://127.0.0.1:${this.port}`, 3_000).build()
            try {
                await api.stop()
                return
            } catch (err) {
                const msg = parseError(err)
                logErrorMessage("Could not shutdown Mysterium node gracefully", msg)
            }
        }
        if (this.proc) {
            log.info("Killing node process", this.proc.pid)
            try {
                this.proc.kill()
            } catch (err) {
                const msg = parseError(err)
                logErrorMessage("Could not kill node process", msg)
            }
        }
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
        return new Promise((resolve) => {
            const cli = spawnProcess(mystBin(), [
                "cli",
                "--agreed-terms-and-conditions",
                `--tequilapi.port=${TEQUILAPI_PORT}`,
                "identities",
                "export",
                id,
                passphrase,
                filename,
            ])
            let err = ""
            cli.stdout?.on("data", (data) => {
                const message = data.toString()
                log.info(message)
                err = parseCLIError(message)
            })
            cli.on("exit", (code) => {
                if (code == 0) {
                    return resolve({
                        result: filename,
                    })
                } else {
                    if (err) {
                        return resolve({ error: err })
                    } else {
                        return resolve({ error: "Failed with status: " + code })
                    }
                }
            })
        })
    }

    importIdentity({ filename, passphrase }: ImportIdentityOpts): Promise<IpcResponse> {
        return new Promise((resolve) => {
            const cli = spawnProcess(mystBin(), [
                "cli",
                "--agreed-terms-and-conditions",
                `--tequilapi.port=${TEQUILAPI_PORT}`,
                "identities",
                "import",
                passphrase,
                filename,
            ])
            let err = ""
            cli.stdout?.on("data", (data) => {
                const message = data.toString()
                log.info(message)
                err = parseCLIError(message)
            })
            cli.on("exit", (code) => {
                if (code == 0) {
                    return resolve({
                        result: filename,
                    })
                } else {
                    if (err) {
                        return resolve({ error: err })
                    } else {
                        return resolve({ error: "Failed with status: " + code })
                    }
                }
            })
        })
    }
}

export const mysteriumNode = new MysteriumNode()
