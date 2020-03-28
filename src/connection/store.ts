/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable, reaction, runInAction } from "mobx"
import tequilapi, {
    ConnectionStatistics,
    ConnectionStatus,
    ConsumerLocation,
    AppState,
    SSEEventType,
} from "mysterium-vpn-js"

import { RootStore } from "../store"
import { eventBus } from "../tequila-sse"
import { DaemonStatusType } from "../daemon/store"
import { newUIProposal, UIProposal } from "../proposals/ui-proposal-type"

const accountantId = "0x0214281cf15c1a66b51990e2e65e1f7b7c363318"

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
    location?: ConsumerLocation
    @observable
    originalLocation?: ConsumerLocation

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        eventBus.on(SSEEventType.AppStateChange, (state: AppState) => {
            if (state.consumer?.connection) {
                this.setStatus(state.consumer.connection.state)
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
            () => this.root.connection.status,
            async (status) => {
                this.resetLocation()
                if ([ConnectionStatus.NOT_CONNECTED, ConnectionStatus.CONNECTED].includes(status)) {
                    await this.resolveLocation()
                }
            },
        )
    }

    @action
    async connect(): Promise<void> {
        if (!this.root.identity.identity || !this.root.proposals.active) {
            return
        }
        this.setConnectInProgress(true)
        this.setGracePeriod()
        try {
            await tequilapi.connectionCreate(
                {
                    consumerId: this.root.identity.identity.id,
                    providerId: this.root.proposals.active.providerId,
                    accountantId,
                    serviceType: this.root.proposals.active.serviceType,
                },
                5000,
            )
        } catch (err) {
            console.error("Could not connect", err.message)
        }
        this.setConnectInProgress(false)
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
            console.error("Connection status check failed", err.message)
            this.setStatus(ConnectionStatus.NOT_CONNECTED)
        }
    }

    @action
    async disconnect(): Promise<void> {
        try {
            await tequilapi.connectionCancel()
        } catch (err) {
            console.error("Failed to disconnect", err.message)
        }
    }

    @action
    async resolveOriginalLocation(): Promise<void> {
        try {
            const location = await tequilapi.location()
            this.setOriginalLocation(location)
        } catch (err) {
            console.error("Failed to lookup original location", err.message)
        }
    }

    @action
    resetLocation(): void {
        this.setLocation({
            country: "Unknown",
            ip: "Updating...",
            asn: 0,
            city: "",
            continent: "",
            isp: "",
            nodeType: "",
        })
    }

    @action
    async resolveLocation(): Promise<void> {
        let location: ConsumerLocation
        try {
            location = await tequilapi.connectionLocation()
        } catch (err) {
            location = {
                country: "Unknown",
                ip: "Updating...",
                asn: 0,
                city: "",
                continent: "",
                isp: "",
                nodeType: "",
            }
            console.error("Failed to lookup location", err.message)
        }
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
    setLocation = (l: ConsumerLocation): void => {
        this.location = l
    }

    @action
    setOriginalLocation = (l: ConsumerLocation): void => {
        this.originalLocation = l
    }

    @action
    setStatistics = (s?: ConnectionStatistics): void => {
        this.statistics = s
    }
}
