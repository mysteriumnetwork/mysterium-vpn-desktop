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
    ipType?: string
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
            async (status) => {
                if (status == DaemonStatusType.Up && this.root.connection.status === ConnectionStatus.NOT_CONNECTED) {
                    await this.fetchProposals()
                }
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
        } catch (err) {
            console.log("Could not get proposals", err.message)
        }
        this.setLoading(false)
    }

    // #####################
    // Access policy filter (invisible yet)
    // #####################

    @computed
    get accessPolicyFiltered(): UIProposal[] {
        const input = this.proposals
        if (!this.filter.noAccessPolicy) {
            return input
        }
        return input.filter((p) => !p.accessPolicies).sort(compareProposal)
    }

    // #####################
    // Text filter
    // #####################

    @action
    setTextFilter(text?: string): void {
        this.filter.text = text
        this.setIpTypeFilter(undefined)
        this.setCountryFilter(undefined)
    }

    @computed
    get textFiltered(): UIProposal[] {
        const input = this.accessPolicyFiltered
        const filterText = this.filter.text
        if (!filterText) {
            return input
        }
        return input.filter((p) => p.providerId.includes(filterText)).sort(compareProposal)
    }

    // #####################
    // IP type filter
    // #####################

    @computed
    get ipTypeCounts(): { [type: string]: number } {
        const input = this.textFiltered
        const result = _.groupBy(input, (p) => p.serviceDefinition.locationOriginate?.nodeType)
        return _.mapValues(result, (ps) => ps.length)
    }

    @action
    setIpTypeFilter(ipType?: string): void {
        this.filter.ipType = ipType
        this.setCountryFilter(undefined)
    }

    @action
    toggleIpTypeFilter(ipType?: string): void {
        this.setIpTypeFilter(this.filter.ipType !== ipType ? ipType : undefined)
    }

    @computed
    get ipTypeFiltered(): UIProposal[] {
        const input = this.textFiltered
        if (!this.filter.ipType) {
            return input
        }
        const ipType = (p: UIProposal): string | undefined => p.serviceDefinition.locationOriginate?.nodeType
        return input.filter((p) => ipType(p) === this.filter.ipType).sort(compareProposal)
    }

    // #####################
    // Country filter
    // #####################

    @computed
    get countryCounts(): { [code: string]: number } {
        const input = this.ipTypeFiltered
        const result = _.groupBy(input, (p) => p.country)
        return _.mapValues(result, (ps) => ps.length)
    }

    @action
    setCountryFilter(countryCode?: string): void {
        this.filter.country = countryCode
    }

    @action
    toggleCountryFilter(countryCode?: string): void {
        this.setCountryFilter(this.filter.country !== countryCode ? countryCode : undefined)
        this.toggleActiveProposal(undefined)
    }

    @computed
    get countryFiltered(): UIProposal[] {
        const input = this.ipTypeFiltered
        if (!this.filter.country) {
            return input
        }
        return input.filter((p) => p.country == this.filter.country).sort(compareProposal)
    }

    // #####################
    // Resulting list of proposals
    // #####################

    @computed
    get filteredProposals(): UIProposal[] {
        return this.countryFiltered
    }

    // #####################
    // End of filters
    // #####################

    set activate(proposal: UIProposal) {
        this.active = proposal
    }

    @action
    toggleActiveProposal(proposal?: UIProposal): void {
        this.active = this.active?.key !== proposal?.key ? proposal : undefined
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
