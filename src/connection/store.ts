import {action, observable, reaction} from "mobx";
import {RootStore} from "../store";
import tequilapi from "../tequila";
import {ConnectionStatus as ConnectionStatusType, HttpTequilapiClient, TequilapiError} from "mysterium-vpn-js";
import {DaemonStatusType} from "../daemon/store";

const accountantId = "0x0214281cf15c1a66b51990e2e65e1f7b7c363318"

export class ConnectionStore {
    @observable
    loading = false
    @observable
    status = ConnectionStatusType.NOT_CONNECTED

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        setInterval(async () => {
            if (this.root.daemon.status == DaemonStatusType.Up) {
                await this.statusCheck()
            }
        }, 500);
    }

    setupReactions() {
        reaction(() => this.root.proposals.active, async (proposal) => {
            await this.connect()
        })
    }

    @action
    async connect() {
        try {
            this.status = ConnectionStatusType.CONNECTING
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

            await (tequilapi as HttpTequilapiClient).http.put("connection", {
                consumerId: this.root.identity.id!,
                providerId: this.root.proposals.active?.providerId!,
                accountantId,
                serviceType: this.root.proposals.active?.serviceType!
            }, 5000)
            // const res = parseConnectionStatusResponse(httpRes);
            // this.status = res.status
        } catch (err) {
            if (err instanceof TequilapiError) {
                // TODO SDK: provide type safe access to errors
                console.error("Could not connect", err.message, JSON.stringify(err))
            } else {
                console.error("Could not connect", err)
            }
            // this.status = ConnectionStatus.NOT_CONNECTED
        }
    }

    @action
    async statusCheck() {
        try {
            const conn = await tequilapi.connectionStatus()
            this.status = conn.status
        } catch (err) {
            console.error("Connection status check failed", err)
            this.status = ConnectionStatusType.NOT_CONNECTED
        }
    }

}
