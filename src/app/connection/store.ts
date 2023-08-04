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
import _ from "lodash"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { newUIProposal, UIProposal } from "../proposals/uiProposal"
import { MainIpcListenChannels } from "../../shared/ipc"
import { log, logErrorMessage } from "../../shared/log/log"
import { eventBus, tequilapi } from "../tequilapi"
import { parseError } from "../../shared/errors/parseError"
import { analytics } from "../analytics/analytics"
import { EventName } from "../analytics/event"

export class ConnectionStore {
    connectInProgress = false
    gracePeriod = false
    status = ConnectionStatus.NOT_CONNECTED
    userCancelled = false
    statistics?: ConnectionStatistics
    proposal?: UIProposal
    location?: Location
    originalLocation?: Location
    natType?: string

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            connectInProgress: observable,
            gracePeriod: observable,
            status: observable,
            userCancelled: observable,
            statistics: observable,
            proposal: observable,
            location: observable,
            originalLocation: observable,
            natType: observable,
            connect: action,
            statusCheck: action,
            disconnect: action,
            resolveOriginalLocation: action,
            resetLocation: action,
            resolveLocation: action,
            currentIp: computed,
            setConnectInProgress: action,
            markUserCancelled: action,
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
                if ([ConnectionStatus.CONNECTING, ConnectionStatus.DISCONNECTING].includes(status)) {
                    this.resetLocation()
                }
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
            (status) => this.root.navigation.navigateOnConnectionStatus(status),
        )
        reaction(
            () => this.root.daemon.status,
            async (status) => {
                if (status === DaemonStatusType.Up) {
                    await this.resolveNATType()
                }
            },
        )
        reaction(
            () => this.root.config.autoNATCompatibility,
            async () => {
                await this.resolveNATType()
            },
        )
        window.addEventListener("online", async () => {
            log.info("Network connection restored")
            await this.resolveNATType()
        })
        window.addEventListener("offline", async () => {
            log.info("Network connection lost")
            await this.resolveNATType()
        })
    }

    async connect(): Promise<void> {
        analytics.event(EventName.manual_connect, { country: this.root.proposals.active?.country })
        return this._doConnect()
    }

    async quickConnect(): Promise<void> {
        const proposal = _.sample(this.root.proposals.filteredProposals)
        this.root.proposals.setActiveProposal(proposal)
        analytics.event(EventName.quick_connect, { country: proposal?.country })
        return this._doConnect()
    }

    private async _doConnect(): Promise<void> {
        analytics.event(EventName.balance_update, {
            balance: Number(this.root.identity.identity?.balanceTokens?.human),
        })
        const proposal = this.root.proposals.active
        if (!this.root.identity.identity || !proposal) {
            return
        }
        this.setConnectInProgress(true)
        this.setGracePeriod()
        const before = new Date()
        try {
            analytics.event(EventName.connect_attempt, { country: proposal.country, provider_id: proposal.providerId })
            await tequilapi.connectionCreate(
                {
                    consumerId: this.root.identity.identity.id,
                    providerId: proposal.providerId,
                    serviceType: proposal.serviceType,
                    connectOptions: {
                        dns: this.root.config.dnsOption,
                    },
                },
                60_000,
            )
            analytics.event(EventName.connect_success, {
                country: proposal.country,
                provider_id: proposal.providerId,
                duration: new Date().getTime() - before.getTime(),
            })
        } catch (err) {
            if (this.userCancelled) {
                analytics.event(EventName.connect_cancel, {
                    country: proposal.country,
                    provider_id: proposal.providerId,
                    duration: new Date().getTime() - before.getTime(),
                })
                return Promise.resolve()
            }
            analytics.event(EventName.connect_failure, {
                country: proposal.country,
                provider_id: proposal.providerId,
                duration: new Date().getTime() - before.getTime(),
            })
            const msg = parseError(err)
            logErrorMessage("Could not connect", msg)
            return Promise.reject(msg.humanReadable)
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
            const msg = parseError(err)
            logErrorMessage("Could not check connection status", msg)
            this.setStatus(ConnectionStatus.NOT_CONNECTED)
        }
    }

    async disconnect(): Promise<void> {
        this.markUserCancelled()
        analytics.event(EventName.balance_update, {
            balance: Number(this.root.identity.identity?.balanceTokens?.human),
        })
        const from = this.root.connection.location?.country
        this.setGracePeriod()
        const before = new Date()
        try {
            analytics.event(EventName.disconnect_attempt, { country: from })
            await tequilapi.connectionCancel()
            const duration = new Date().getTime() - before.getTime()
            analytics.event(EventName.disconnect_success, { country: from, duration })
        } catch (err) {
            const duration = new Date().getTime() - before.getTime()
            analytics.event(EventName.disconnect_failure, { country: from, duration })
            const msg = parseError(err)
            logErrorMessage("Failed to disconnect", msg)
        }
    }

    async resolveOriginalLocation(): Promise<void> {
        try {
            const location = await tequilapi.location()
            this.setOriginalLocation(location)
        } catch (err) {
            const msg = parseError(err)
            logErrorMessage("Failed to lookup original location", msg)
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
            ipType: "",
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
            ipType: "",
        }
        const MAX_RETRIES = 5
        await retry(
            async () => {
                location = await tequilapi.connectionLocation()
            },
            {
                retries: MAX_RETRIES,
                onRetry: (e, attempt) =>
                    log.warn(`Failed to update location (${attempt}/${MAX_RETRIES}): ${e.message}`),
            },
        )
        this.setLocation(location)
    }

    async resolveNATType(): Promise<void> {
        if (this.root.config.autoNATCompatibility && this.status !== ConnectionStatus.CONNECTED) {
            log.info("Resolving NAT type...")
            try {
                const natType = await tequilapi.natType()
                runInAction(() => {
                    this.natType = natType.type
                })
                log.info("Resolved NAT type:", natType.type || natType)
            } catch (err) {
                log.error("Could not resolve NAT type:", err)
            }
        }
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

    markUserCancelled = (): void => {
        runInAction(() => {
            this.userCancelled = true
        })
        setTimeout(() => {
            runInAction(() => {
                this.userCancelled = false
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
