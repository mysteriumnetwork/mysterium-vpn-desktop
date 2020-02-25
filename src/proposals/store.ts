import {action, observable, reaction, toJS} from "mobx";
import {RootStore} from "../store";
import {DaemonStatusType} from "../daemon/store";
import tequilapi from "../tequila";
import {Proposal} from "mysterium-vpn-js";

export class ProposalStore {
    @observable
    loading = false
    @observable
    proposals: Proposal[] = []

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        reaction(() => this.root.daemon.status, async (status) => {
            if (status == DaemonStatusType.Up) {
                await this.fetchProposals()
            }
        })
    }

    @action
    async fetchProposals() {
        this.loading = true
        try {
            this.proposals = await tequilapi.findProposals({fetchConnectCounts: true})
            console.log(toJS(this.proposals))
        } catch (err) {
            console.log("Could not get proposals", err)
        }
        this.loading = false
    }

}
