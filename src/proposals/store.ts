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

    @computed
    get byCountryCounts(): { [code: string]: number } {
        const result = _.groupBy(this.textFiltered, (p) => p.country)
        return _.mapValues(result, (ps) => ps.length)
    }

    @computed
    get accessPolicyFiltered(): UIProposal[] {
        const input = this.proposals
        if (!this.filter.noAccessPolicy) {
            return input
        }
        return input.filter((p) => !p.accessPolicies).sort(compareProposal)
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

    @computed
    get countryFiltered(): UIProposal[] {
        const input = this.textFiltered
        if (!this.filter.country) {
            return input
        }
        return input.filter((p) => p.country == this.filter.country).sort(compareProposal)
    }

    @computed
    get filteredProposals(): UIProposal[] {
        return this.countryFiltered
    }

    @action
    setTextFilter(text?: string): void {
        this.filter.text = text
    }

    @action
    toggleFilterCountry(countryCode?: string): void {
        this.filter.country = this.filter.country !== countryCode ? countryCode : undefined
        this.toggleActiveProposal(undefined)
    }

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
