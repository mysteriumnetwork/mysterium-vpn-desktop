/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action, makeObservable, observable, reaction, when } from "mobx"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { log, logErrorMessage } from "../../shared/log/log"
import { sseConnect, tequilapi } from "../tequilapi"
import { MainIpcListenChannels, WebIpcListenChannels } from "../../shared/ipc"
import { mysteriumNodeIPC } from "../../shared/node/mysteriumNodeIPC"
import { supervisorIPC } from "../../shared/node/supervisorIPC"
import { parseError } from "../../shared/errors/parseError"

export enum DaemonStatusType {
    Up = "UP",
    Down = "DOWN",
}

export enum StartupStatus {
    CheckingForUpdates = "Checking for updates",
    UpdateAvailable = "Update available",
    UpdateNotAvailable = "No update available",
    Downloading = "Downloading update",
    DownloadingComplete = "Download complete. Restart the app to upgrade!",
    KillingGhosts = "Killing ghosts",
    StartingDaemon = "Starting daemon",
}

export class DaemonStore {
    statusLoading = false
    status = DaemonStatusType.Down
    startupStatus = StartupStatus.CheckingForUpdates
    starting = false

    eventSource?: EventSource

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            statusLoading: observable,
            status: observable,
            startupStatus: observable,
            starting: observable,
            setStartupStatus: action,
            healthcheck: action,
            update: action,
            start: action,
            supervisorInstall: action,
            setStatus: action,
            setStarting: action,
            setStatusLoading: action,
        })
        this.root = root
        setInterval(async () => {
            await this.healthcheck()
        }, 5_000)
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

    setStartupStatus(status: StartupStatus): void {
        this.startupStatus = status
    }

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
            await tequilapi.healthCheck(10_000)
            this.setStatus(DaemonStatusType.Up)
        } catch (err) {
            const msg = parseError(err)
            logErrorMessage("Healthcheck failed", msg)
            this.setStatus(DaemonStatusType.Down)
        }
        this.setStatusLoading(false)
    }

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

    async start(): Promise<void> {
        if (this.status == DaemonStatusType.Up) {
            log.info("Mysterium Node is already running")
            return
        }
        log.info("Starting Mysterium Node")
        if (this.starting) {
            log.info("Already starting")
            return
        }
        this.setStarting(true)
        try {
            await supervisorIPC.connect()
        } catch (err) {
            const msg = parseError(err)
            logErrorMessage("Failed to connect to the supervisor, installing", msg)
            await this.supervisorInstall()
        }

        await supervisorIPC.upgrade()
        this.setStartupStatus(StartupStatus.KillingGhosts)
        await mysteriumNodeIPC.killGhosts()
        this.setStartupStatus(StartupStatus.StartingDaemon)
        await mysteriumNodeIPC.start()
        this.setStarting(false)
    }

    async supervisorInstall(): Promise<void> {
        try {
            return await supervisorIPC.install()
        } catch (err) {
            log.error("Failed to install supervisor", err)
        }
    }

    setStatus = (s: DaemonStatusType): void => {
        this.status = s
    }

    setStarting = (s: boolean): void => {
        this.starting = s
    }

    setStatusLoading = (s: boolean): void => {
        this.statusLoading = s
    }
}
