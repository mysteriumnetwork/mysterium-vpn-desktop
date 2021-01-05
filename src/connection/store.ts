/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable, reaction, runInAction } from "mobx"
import tequilapi, { AppState, ConnectionStatistics, ConnectionStatus, Location, SSEEventType } from "mysterium-vpn-js"
import { ipcRenderer } from "electron"
import retry from "async-retry"

import { RootStore } from "../store"
import { eventBus } from "../tequila-sse"
import { DaemonStatusType } from "../daemon/store"
import { newUIProposal, UIProposal } from "../proposals/ui-proposal-type"
import { MainIpcListenChannels } from "../main/ipc"
import { analytics } from "../analytics/analytics-ui"
import { AppAction, Category, ConnectAction } from "../analytics/analytics"
import { log } from "../log/log"

export class ConnectionStore {
    @observable
    connectInProgress = false
    @observable
    gracePeriod = false
    @observable
    status = ConnectionStatus.NOT_CONNECTED
    @observable
    statistics?: ConnectionStatistics
    @observable
    proposal?: UIProposal
    @observable
    location?: Location
    @observable
    originalLocation?: Location

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        eventBus.on(SSEEventType.AppStateChange, (state: AppState) => {
            if (state.consumer?.connection) {
                this.setStatus(state.consumer.connection.status)
                this.setStatistics(state.consumer.connection.statistics)
            }
            if (state.consumer?.connection?.proposal) {
                this.setProposal(newUIProposal(state.consumer.connection.proposal))
            } else {
                this.setProposal(undefined)
            }
        })
        reaction(
            () => this.root.daemon.status,
            async (status) => {
                analytics.event(Category.App, AppAction.DaemonStatusChanged, status)
                if (status == DaemonStatusType.Up) {
                    await this.resolveOriginalLocation()
                }
            },
        )
        reaction(
            () => this.root.connection.status,
            async (status) => {
                analytics.event(Category.Connection, ConnectAction.StatusChanged, status)
                this.resetLocation()
                if ([ConnectionStatus.NOT_CONNECTED, ConnectionStatus.CONNECTED].includes(status)) {
                    await this.resolveLocation()
                }
            },
        )
        reaction(
            () => this.root.connection.status,
            (status) => {
                ipcRenderer.send(MainIpcListenChannels.ConnectionStatus, status)
            },
            { name: "Notify tray with new connection status" },
        )
        // analytics
        reaction(
            () => this.root.daemon.status,
            async (status) => {
                analytics.event(Category.App, AppAction.DaemonStatusChanged, status)
            },
        )
        reaction(
            () => this.root.connection.status,
            async (status) => {
                analytics.event(Category.Connection, ConnectAction.StatusChanged, status)
            },
        )
    }

    @action
    async connect(): Promise<void> {
        if (!this.root.identity.identity || !this.root.proposals.active) {
            return
        }
        analytics.event(Category.Connection, ConnectAction.Connect, this.root.proposals.active.country)
        this.setConnectInProgress(true)
        this.setGracePeriod()
        try {
            await tequilapi.connectionCreate(
                {
                    consumerId: this.root.identity.identity.id,
                    providerId: this.root.proposals.active.providerId,
                    serviceType: this.root.proposals.active.serviceType,
                    connectOptions: {
                        dns: this.root.config.dnsOption,
                    },
                },
                30000,
            )
        } catch (err) {
            log.error("Could not connect", err.message)
            throw err
        } finally {
            this.setConnectInProgress(false)
        }
    }

    @action
    async statusCheck(): Promise<void> {
        try {
            if (this.connectInProgress) {
                return
            }
            const conn = await tequilapi.connectionStatus()
            if (this.connectInProgress) {
                return
            }
            this.setStatus(conn.status)
        } catch (err) {
            log.error("Connection status check failed", err.message)
            this.setStatus(ConnectionStatus.NOT_CONNECTED)
        }
    }

    @action
    async disconnect(): Promise<void> {
        analytics.event(Category.Connection, ConnectAction.Disconnect, this.root.connection.location?.country)
        this.setGracePeriod()
        try {
            await tequilapi.connectionCancel()
        } catch (err) {
            log.error("Failed to disconnect", err.message)
        }
    }

    @action
    async resolveOriginalLocation(): Promise<void> {
        try {
            const location = await tequilapi.location()
            this.setOriginalLocation(location)
        } catch (err) {
            log.error("Failed to lookup original location", err.message)
        }
    }

    @action
    resetLocation(): void {
        this.setLocation({
            country: "unknown",
            ip: "Updating...",
            asn: 0,
            city: "",
            continent: "",
            isp: "",
            userType: "",
        })
    }

    @action
    async resolveLocation(): Promise<void> {
        let location: Location = {
            country: "unknown",
            ip: "Updating...",
            asn: 0,
            city: "",
            continent: "",
            isp: "",
            userType: "",
        }
        await retry(
            async () => {
                location = await tequilapi.connectionLocation()
            },
            {
                retries: 5,
                onRetry: (e, attempt) => log.warn(`Retrying location update (${attempt}): ${e.message}`),
            },
        )
        this.setLocation(location)
    }

    @action
    setConnectInProgress = (b: boolean): void => {
        this.connectInProgress = b
    }

    @action
    setGracePeriod = (): void => {
        this.gracePeriod = true
        setTimeout(() => {
            runInAction(() => {
                this.gracePeriod = false
            })
        }, 5000)
    }

    @action
    setStatus = (s: ConnectionStatus): void => {
        this.status = s
    }

    @action
    setProposal = (p?: UIProposal): void => {
        this.proposal = p
    }

    @action
    setLocation = (l: Location): void => {
        this.location = l
    }

    @action
    setOriginalLocation = (l: Location): void => {
        this.originalLocation = l
    }

    @action
    setStatistics = (s?: ConnectionStatistics): void => {
        this.statistics = s
    }
}
