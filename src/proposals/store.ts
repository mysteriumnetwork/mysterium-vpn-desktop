import { action, computed, observable, reaction } from "mobx"
import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import tequilapi from "../tequila"
import * as _ from "lodash"
import { newUIProposal, UIProposal, compareProposal } from "./ui-proposal-type"

const supportedServiceTypes = ["openvpn", "wireguard"]

export type ProposalFilter = {
    country?: string
    noAccessPolicy?: boolean
}

export class ProposalStore {
    @observable
    loading = false
    @observable
    proposals: UIProposal[] = []
    @observable
    active?: UIProposal

    @observable
    filter: ProposalFilter = {
        noAccessPolicy: true,
    }

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        reaction(
            () => this.root.daemon.status,
            async status => {
                if (status == DaemonStatusType.Up) {
                    await this.fetchProposals()
                }
            },
        )
    }

    @action
    async fetchProposals(): Promise<void> {
        this.loading = true
        try {
            this.proposals = await tequilapi
                .findProposals()
                .then(proposals => proposals.filter(p => supportedServiceTypes.includes(p.serviceType)))
                .then(proposals => proposals.map(newUIProposal))
        } catch (err) {
            console.log("Could not get proposals", err)
        }
        this.loading = false
    }

    @computed
    get byCountry(): { [code: string]: UIProposal[] } {
        const result = _.groupBy(this.proposals, p => p.country)
        return _.mapValues(result, ps => ps.sort(compareProposal))
    }

    @computed
    get byCountryCounts(): { [code: string]: number } {
        const result = _.groupBy(this.proposals, p => p.country)
        return _.mapValues(result, ps => ps.length)
    }

    @computed
    get byFilter(): UIProposal[] {
        return this.proposals.filter(p => {
            if (this.filter.country != null && p.country != this.filter.country) {
                return false
            }
            if (this.filter.noAccessPolicy && p.accessPolicies) {
                return false
            }
            return true
        })
    }

    set activate(proposal: UIProposal) {
        if (!this.root.connection.canConnect) {
            return
        }
        console.info("Selected proposal", JSON.stringify(proposal))
        this.active = proposal
    }

    set toggleFilterCountry(countryCode: string) {
        this.filter.country = this.filter.country !== countryCode ? countryCode : undefined
    }
}
