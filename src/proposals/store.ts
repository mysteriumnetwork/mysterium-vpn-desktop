import { action, computed, observable, reaction } from "mobx"
import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import tequilapi from "../tequila"
import * as _ from "lodash"
import { compareProposal, newUIProposal, UIProposal } from "./ui-proposal-type"

const supportedServiceTypes = ["openvpn", "wireguard"]

const proposalRefreshRate = 10000

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
    @observable
    apFiltered: UIProposal[] = []
    @observable
    countryFiltered: UIProposal[] = []

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
                    this.applyCountryFilter() // Refresh (load) main view initially
                }
            },
        )
        setInterval(async () => {
            if (this.root.daemon.status != DaemonStatusType.Up) {
                return
            }
            await this.fetchProposals()
        }, proposalRefreshRate)
    }

    @action
    async fetchProposals(): Promise<void> {
        this.setLoading(true)
        try {
            const proposals = await tequilapi
                .findProposals()
                .then(proposals => proposals.filter(p => supportedServiceTypes.includes(p.serviceType)))
                .then(proposals => proposals.map(newUIProposal))
            this.setProposals(proposals)
            this.applyAccessPolicyFilter() // Only reflect update in the sidebar, not refreshing main view (not to bother the user)
        } catch (err) {
            console.log("Could not get proposals", err)
        }
        this.setLoading(false)
    }

    @computed
    get byCountryCounts(): { [code: string]: number } {
        const result = _.groupBy(this.apFiltered, p => p.country)
        return _.mapValues(result, ps => ps.length)
    }

    set activate(proposal: UIProposal) {
        if (!this.root.connection.canConnect) {
            return
        }
        console.info("Selected proposal", JSON.stringify(proposal))
        this.active = proposal
    }

    @action
    toggleActiveProposal(proposal?: UIProposal): void {
        this.active = this.active?.key !== proposal?.key ? proposal : undefined
    }

    set toggleAccessPolicyFilter(noAccessPolicies: boolean) {
        this.filter.noAccessPolicy = noAccessPolicies
        this.applyAccessPolicyFilter()
    }

    @action
    applyAccessPolicyFilter(): void {
        this.apFiltered = this.proposals
            .filter(p => !this.filter.noAccessPolicy || !p.accessPolicies)
            .sort(compareProposal)
    }

    @action
    toggleFilterCountry(countryCode?: string): void {
        this.filter.country = this.filter.country !== countryCode ? countryCode : undefined
        this.applyCountryFilter()
    }

    @action
    applyCountryFilter(): void {
        this.countryFiltered = this.apFiltered
            .filter(p => this.filter.country == null || p.country == this.filter.country)
            .sort(compareProposal)
    }

    @action
    setLoading = (b: boolean): void => {
        this.loading = b
    }

    @action
    setProposals = (proposals: UIProposal[]): void => {
        this.proposals = proposals
    }
}
