import {action, computed, observable, reaction} from "mobx";
import {RootStore} from "../store";
import {DaemonStatusType} from "../daemon/store";
import tequilapi from "../tequila";
import * as _ from "lodash";
import {newUIProposal, UIProposal} from "./ui-proposal-type";

const compareProposal = (a: UIProposal, b: UIProposal): number => a.key.localeCompare(b.key)

export class ProposalStore {
    @observable
    loading = false
    @observable
    proposals: UIProposal[] = []
    @observable
    active?: UIProposal

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions() {
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
            this.proposals = await tequilapi.findProposals().then(proposals => proposals.map(newUIProposal))
        } catch (err) {
            console.log("Could not get proposals", err)
        }
        this.loading = false
    }

    @computed
    get byCountry(): { [code: string]: UIProposal[] } {
        let result = _.groupBy(this.proposals, p => p.country);
        return _.mapValues(result, ps => ps.sort(compareProposal))
    }

    set activate(proposal: UIProposal) {
        console.info("Selected proposal", JSON.stringify(proposal))
        this.active = proposal
    }

}
