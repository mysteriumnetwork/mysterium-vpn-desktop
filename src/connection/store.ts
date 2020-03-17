/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable, reaction, runInAction } from "mobx"
import { RootStore } from "../store"
import tequilapi from "../tequila"
import { ConnectionStatus, ConsumerLocation, HttpTequilapiClient } from "mysterium-vpn-js"
import { DaemonStatusType } from "../daemon/store"

const accountantId = "0x0214281cf15c1a66b51990e2e65e1f7b7c363318"

export class ConnectionStore {
    @observable
    connectInProgress = false
    @observable
    gracePeriod = false
    @observable
    status = ConnectionStatus.NOT_CONNECTED
    @observable
    location?: ConsumerLocation
    @observable
    originalLocation?: ConsumerLocation

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        setInterval(async () => {
            if (this.root.daemon.status == DaemonStatusType.Up) {
                await this.statusCheck()
            }
        }, 1000)
    }

    setupReactions(): void {
        reaction(
            () => this.root.daemon.status,
            async status => {
                if (status == DaemonStatusType.Up) {
                    await this.resolveOriginalLocation()
                }
            },
        )
        reaction(
            () => this.root.connection.status,
            async status => {
                if ([ConnectionStatus.NOT_CONNECTED, ConnectionStatus.CONNECTED].includes(status)) {
                    await this.resolveLocation()
                }
            },
        )
    }

    @action
    async connect(): Promise<void> {
        this.setConnectInProgress(true)
        this.setGracePeriod()
        try {
            this.setStatus(ConnectionStatus.CONNECTING)
            // this.status = ConnectionStatusType.CONNECTING
            // TODO SDK: add accountantId
            // TODO SDK: remove object remapping! (just passthrough all fields to the API);
            // const req = {
            //     consumerId: this.root.identity.id!,
            //     providerId: this.root.proposals.active?.providerId!,
            //
            //     //           devs should be able to pass unknown props, e.g. when SDK is outdated.
            //     accountantId: accountantId,
            //     serviceType: this.root.proposals.active?.serviceType!
            // };
            // const res = await tequilapi.connectionCreate(req)

            await (tequilapi as HttpTequilapiClient).http.put(
                "connection",
                {
                    consumerId: this.root.identity.id,
                    providerId: this.root.proposals.active?.providerId,
                    accountantId,
                    serviceType: this.root.proposals.active?.serviceType,
                },
                5000,
            )
            // const res = parseConnectionStatusResponse(httpRes);
            // this.status = res.status
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
                // eslint-disable-next-line @typescript-eslint/camelcase
                node_type: "",
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
    setLocation = (l: ConsumerLocation): void => {
        this.location = l
    }

    @action
    setOriginalLocation = (l: ConsumerLocation): void => {
        this.originalLocation = l
    }
}
