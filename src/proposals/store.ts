/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, reaction } from "mobx"
import tequilapi, { ConnectionStatus } from "mysterium-vpn-js"
import * as _ from "lodash"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"

import { compareProposal, newUIProposal, UIProposal } from "./ui-proposal-type"

const supportedServiceTypes = ["openvpn", "wireguard"]

const proposalRefreshRate = 10000

export type ProposalFilter = {
    text?: string
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
    textFiltered: UIProposal[] = []

    @observable
    countryFiltered: UIProposal[] = []

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        reaction(
            () => this.root.daemon.status,
            async (status) => {
                if (status == DaemonStatusType.Up && this.root.connection.status === ConnectionStatus.NOT_CONNECTED) {
                    await this.fetchProposals()
                    this.applyTextFilter()
                    this.applyCountryFilter() // Refresh (load) main view initially
                }
            },
        )
        reaction(
            () => this.filter.text,
            () => {
                this.toggleFilterCountry(undefined)
                this.applyTextFilter()
            },
        )
        setInterval(async () => {
            if (this.root.daemon.status != DaemonStatusType.Up) {
                return
            }
            if (this.root.connection.status === ConnectionStatus.NOT_CONNECTED) {
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
                .then((proposals) => proposals.filter((p) => supportedServiceTypes.includes(p.serviceType)))
                .then((proposals) => proposals.map(newUIProposal))
            this.setProposals(proposals)
            this.applyAccessPolicyFilter() // Only reflect update in the sidebar, not refreshing main view (not to bother the user)
        } catch (err) {
            console.log("Could not get proposals", err.message)
        }
        this.setLoading(false)
    }

    @computed
    get byCountryCounts(): { [code: string]: number } {
        const result = _.groupBy(this.apFiltered, (p) => p.country)
        return _.mapValues(result, (ps) => ps.length)
    }

    set activate(proposal: UIProposal) {
        this.active = proposal
    }

    @action
    toggleActiveProposal(proposal?: UIProposal): void {
        this.active = this.active?.key !== proposal?.key ? proposal : undefined
    }

    @computed
    get filteredProposals(): UIProposal[] {
        if (this.filter.text) {
            return this.textFiltered
        }
        return this.countryFiltered
    }

    @action
    setTextFilter(text?: string): void {
        this.filter.text = text
    }

    set toggleAccessPolicyFilter(noAccessPolicies: boolean) {
        this.filter.noAccessPolicy = noAccessPolicies
        this.applyAccessPolicyFilter()
    }

    @action
    applyAccessPolicyFilter(): void {
        this.apFiltered = this.proposals
            .filter((p) => !this.filter.noAccessPolicy || !p.accessPolicies)
            .sort(compareProposal)
    }

    @action
    applyTextFilter(): void {
        if (this.filter.text) {
            const filterText = this.filter.text
            this.textFiltered = this.apFiltered.filter((p) => p.providerId.includes(filterText)).sort(compareProposal)
        } else {
            this.textFiltered = []
        }
    }

    @action
    toggleFilterCountry(countryCode?: string): void {
        this.filter.country = this.filter.country !== countryCode ? countryCode : undefined
        this.toggleActiveProposal(undefined)
        this.applyCountryFilter()
    }

    @action
    applyCountryFilter(): void {
        this.countryFiltered = this.apFiltered
            .filter((p) => this.filter.country == null || p.country == this.filter.country)
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
