/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx"
import { AppState, ConnectionStatistics, ConnectionStatus, Location, SSEEventType } from "mysterium-vpn-js"
import { ipcRenderer } from "electron"
import retry from "async-retry"

import { RootStore } from "../store"
import { eventBus } from "../tequila-sse"
import { DaemonStatusType } from "../daemon/store"
import { newUIProposal, UIProposal } from "../proposals/ui-proposal-type"
import { MainIpcListenChannels } from "../../shared/ipc"
import { appStateEvent, userEvent } from "../analytics/analytics"
import { log } from "../../shared/log/log"
import { tequilapi } from "../tequilapi"
import { AppStateAction, ConnectionAction } from "../../shared/analytics/actions"

export class ConnectionStore {
    connectInProgress = false
    gracePeriod = false
    status = ConnectionStatus.NOT_CONNECTED
    statistics?: ConnectionStatistics
    proposal?: UIProposal
    location?: Location
    originalLocation?: Location

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            connectInProgress: observable,
            gracePeriod: observable,
            status: observable,
            statistics: observable,
            proposal: observable,
            location: observable,
            originalLocation: observable,
            connect: action,
            statusCheck: action,
            disconnect: action,
            resolveOriginalLocation: action,
            resetLocation: action,
            resolveLocation: action,
            currentIp: computed,
            setConnectInProgress: action,
            setGracePeriod: action,
            setStatus: action,
            setProposal: action,
            setLocation: action,
            setOriginalLocation: action,
            setStatistics: action,
        })
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
                if (status == DaemonStatusType.Up) {
                    await this.resolveOriginalLocation()
                }
            },
        )
        reaction(
            () => this.status,
            async (status) => {
                appStateEvent(AppStateAction.ConnectionStatus, status)
                switch (status) {
                    case ConnectionStatus.CONNECTED:
                        appStateEvent(AppStateAction.ConnectedCountry, this.proposal?.country)
                        break
                    case ConnectionStatus.DISCONNECTING:
                        appStateEvent(AppStateAction.DisconnectedCountry, this.proposal?.country)
                        break
                }
                this.resetLocation()
                if ([ConnectionStatus.NOT_CONNECTED, ConnectionStatus.CONNECTED].includes(status)) {
                    await this.resolveLocation()
                }
            },
        )
        reaction(
            () => this.status,
            (status) => {
                ipcRenderer.send(MainIpcListenChannels.ConnectionStatus, status)
            },
            { name: "Notify tray with new connection status" },
        )
        reaction(
            () => this.root.connection.status,
            () => {
                this.root.navigation.determineRoute()
            },
        )
    }

    async connect(): Promise<void> {
        if (!this.root.identity.identity || !this.root.proposals.active) {
            return
        }
        userEvent(ConnectionAction.Connect, this.root.proposals.active.country)
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
                30_000,
            )
        } catch (err) {
            log.error("Could not connect", err.message)
            return Promise.reject(err.message)
        } finally {
            this.setConnectInProgress(false)
        }
    }

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

    async disconnect(): Promise<void> {
        userEvent(ConnectionAction.Disconnect, this.root.connection.location?.country)
        this.setGracePeriod()
        try {
            await tequilapi.connectionCancel()
        } catch (err) {
            log.error("Failed to disconnect", err.message)
        }
    }

    async resolveOriginalLocation(): Promise<void> {
        try {
            const location = await tequilapi.location()
            this.setOriginalLocation(location)
        } catch (err) {
            log.error("Failed to lookup original location", err.message)
        }
    }

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

    get currentIp(): string {
        if (this.status === ConnectionStatus.CONNECTED) {
            return this.location?.ip ?? ""
        }
        return this.originalLocation?.ip ?? ""
    }

    setConnectInProgress = (b: boolean): void => {
        this.connectInProgress = b
    }

    setGracePeriod = (): void => {
        this.gracePeriod = true
        setTimeout(() => {
            runInAction(() => {
                this.gracePeriod = false
            })
        }, 5000)
    }

    setStatus = (s: ConnectionStatus): void => {
        this.status = s
    }

    setProposal = (p?: UIProposal): void => {
        this.proposal = p
    }

    setLocation = (l: Location): void => {
        this.location = l
    }

    setOriginalLocation = (l: Location): void => {
        this.originalLocation = l
    }

    setStatistics = (s?: ConnectionStatistics): void => {
        this.statistics = s
    }
}
