/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action, observable, reaction, when } from "mobx"
import { remote } from "electron"
import portscanner from "portscanner"

import { sseConnect } from "../tequila-sse"
import { RootStore } from "../store"
import { Supervisor } from "../supervisor/supervisor"
import { log } from "../log/log"
import { DEFAULT_TEQUILAPI_PORT, defaultTequilapi, rebuildTequilapiClient, tequilapi } from "../tequilapi"

const supervisor: Supervisor = remote.getGlobal("supervisor")

export enum DaemonStatusType {
    Up = "UP",
    Down = "DOWN",
}

export class DaemonStore {
    @observable
    statusLoading = false
    @observable
    status = DaemonStatusType.Down

    @observable
    starting = false

    @observable
    tequilApiPort = DEFAULT_TEQUILAPI_PORT

    eventSource?: EventSource

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        setInterval(async () => {
            await this.healthcheck()
        }, 2000)
    }

    setupReactions(): void {
        when(
            () => this.status == DaemonStatusType.Down,
            async () => {
                this.root.navigation.showLoading()
                await this.start()
            },
        )
        reaction(
            () => this.status,
            async (status) => {
                if (status == DaemonStatusType.Up) {
                    this.eventSource = sseConnect()
                } else {
                    this.root.navigation.showLoading()
                    await this.start()
                }
            },
        )
        reaction(
            () => this.tequilApiPort,
            async (port: number) => {
                rebuildTequilapiClient(port)
            },
        )
    }

    @action
    async healthcheck(): Promise<void> {
        if (this.starting) {
            log.info("Daemon is starting, skipping healthcheck")
            return
        }
        if (this.statusLoading) {
            log.info("Another healthcheck is in progress, skipping")
            return
        }
        this.setStatusLoading(true)
        try {
            await tequilapi().healthCheck(10000)
            this.setStatus(DaemonStatusType.Up)
        } catch (err) {
            log.error("Healthcheck failed:", err.message)
            this.setStatus(DaemonStatusType.Down)
        }
        this.setStatusLoading(false)
    }

    @action
    async start(): Promise<void> {
        if (this.starting) {
            log.info("Already starting")
            return
        }
        this.setStarting(true)
        try {
            await supervisor.connect()
        } catch (err) {
            log.error("Failed to connect to the supervisor, installing", err.message)
            await this.supervisorInstall()
        }

        try {
            // maybe 4050 is used by already running myst node
            await defaultTequilapi().healthCheck()
        } catch (err) {
            // if not, discover port
            const port = await this.discoverTequilApiPort(DEFAULT_TEQUILAPI_PORT, DEFAULT_TEQUILAPI_PORT + 20)
            log.info(`Port: ${port} discovered for tequilApi`)
            this.setTequilApiPort(port)
        }

        await supervisor.upgrade()
        await supervisor.startMyst(this.tequilApiPort)
        this.setStarting(false)
    }

    @action
    async discoverTequilApiPort(from: number, to: number): Promise<number> {
        log.info(`Discovering free port for tequilApi: [${from} - ${to}]`)
        return portscanner.findAPortNotInUse(from, to, "127.0.0.1")
    }

    @action
    async supervisorInstall(): Promise<void> {
        try {
            return await supervisor.install()
        } catch (err) {
            log.error("Failed to install supervisor", err)
        }
    }

    @action
    setStatus = (s: DaemonStatusType): void => {
        this.status = s
    }

    @action
    setStarting = (s: boolean): void => {
        this.starting = s
    }

    @action
    setStatusLoading = (s: boolean): void => {
        this.statusLoading = s
    }

    @action
    setTequilApiPort = (p: number): void => {
        this.tequilApiPort = p
    }
}
