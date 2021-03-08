/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action, observable, reaction, when } from "mobx"
import { ipcRenderer, remote } from "electron"

import { sseConnect } from "../tequila-sse"
import { RootStore } from "../store"
import { Supervisor } from "../supervisor/supervisor"
import { log } from "../log/log"
import { tequilapi, TEQUILAPI_PORT } from "../tequilapi"
import { MainIpcListenChannels, WebIpcListenChannels } from "../main/ipc"
import { isProduction } from "../utils/env"

const supervisor: Supervisor = remote.getGlobal("supervisor")

export enum DaemonStatusType {
    Up = "UP",
    Down = "DOWN",
}

export enum StartupStatus {
    CheckingForUpdates = "Checking for updates",
    UpdateAvailable = "Update available",
    UpdateNotAvailable = "No update available",
    Downloading = "Downloading update",
    DownloadingComplete = "Download complete. Restarting...",
    KillingGhosts = "Killing ghosts",
    StartingDaemon = "Starting daemon",
}

export class DaemonStore {
    @observable
    statusLoading = false
    @observable
    status = DaemonStatusType.Down

    @observable
    startupStatus = StartupStatus.CheckingForUpdates

    @observable
    starting = false

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
            () => this.startupStatus == StartupStatus.UpdateNotAvailable,
            async () => {
                await this.start()
            },
        )
        reaction(
            () => this.status,
            async (status) => {
                if (status == DaemonStatusType.Up) {
                    this.eventSource = sseConnect()
                }
            },
        )
        this.root.navigation.showLoading()
        this.update()
    }

    @action
    setStartupStatus(status: StartupStatus): void {
        this.startupStatus = status
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
            await tequilapi.healthCheck(10000)
            this.setStatus(DaemonStatusType.Up)
        } catch (err) {
            log.error("Healthcheck failed:", err.message)
            this.setStatus(DaemonStatusType.Down)
        }
        this.setStatusLoading(false)
    }

    @action
    async update(): Promise<void> {
        ipcRenderer.send(MainIpcListenChannels.Update)
        ipcRenderer.on(WebIpcListenChannels.UpdateAvailable, () => {
            log.info("Update available", this.startupStatus)
            if (this.startupStatus == StartupStatus.CheckingForUpdates) {
                this.setStartupStatus(StartupStatus.UpdateAvailable)
            }
        })
        ipcRenderer.on(WebIpcListenChannels.UpdateNotAvailable, () => {
            log.info("Update not available", this.startupStatus)
            if (this.startupStatus == StartupStatus.CheckingForUpdates) {
                this.setStartupStatus(StartupStatus.UpdateNotAvailable)
            }
        })
        ipcRenderer.on(WebIpcListenChannels.UpdateDownloading, () => {
            this.setStartupStatus(StartupStatus.Downloading)
        })
        ipcRenderer.on(WebIpcListenChannels.UpdateDownloadComplete, () => {
            this.setStartupStatus(StartupStatus.DownloadingComplete)
        })
        setTimeout(() => {
            if (this.startupStatus == StartupStatus.CheckingForUpdates) {
                log.info("Update timeout", this.startupStatus)
                this.setStartupStatus(StartupStatus.UpdateNotAvailable)
            }
        }, 5_000)
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

        await supervisor.upgrade()
        this.setStartupStatus(StartupStatus.KillingGhosts)
        if (isProduction()) {
            await Promise.all([supervisor.killGhost(4050), supervisor.killGhost(44050)])
        }
        this.setStartupStatus(StartupStatus.StartingDaemon)
        await supervisor.startMyst(TEQUILAPI_PORT)
        this.setStarting(false)
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
}
