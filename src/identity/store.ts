import tequilapi from "../tequila";
import {action, observable, reaction} from "mobx";
import {RootStore} from "../store";
import {DaemonStatusType} from "../daemon/store";

export class IdentityStore {
    @observable
    loading = false
    @observable
    id?: string

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        reaction(() => this.root.daemon.status, async (status) => {
            if (status == DaemonStatusType.Up) {
                await this.currentIdentity()
            } else {
                this.id = undefined
            }
        })
    }

    @action
    async currentIdentity() {
        this.loading = true
        try {
            const identity = await tequilapi.identityCurrent("")
            this.id = identity.id
        } catch (err) {
            console.log("Could not get current identity")
        }
        this.loading = false
    }

}
