/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, reaction } from "mobx"
import tequilapi, {
    ConnectionStatus,
    ProposalMetrics,
    ProposalQuality,
    QualityCalculator,
    QualityLevel,
} from "mysterium-vpn-js"
import * as _ from "lodash"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"

import { compareProposal, newUIProposal, ProposalKey, proposalKey, UIProposal } from "./ui-proposal-type"

const qc = new QualityCalculator()

const qualityLevel = (metrics?: ProposalMetrics): QualityLevel | undefined => {
    if (!metrics) {
        return QualityLevel.UNKNOWN
    }
    const qualityValue = qc.calculateValue(metrics)
    return qc.calculateLevel(qualityValue)
}

const supportedServiceTypes = ["openvpn", "wireguard"]

const proposalRefreshRate = 10000

export type ProposalFilter = {
    noAccessPolicy?: boolean
    text?: string
    quality?: QualityLevel
    ipType?: string
    country?: string
}

export class ProposalStore {
    @observable
    loading = false
    @observable
    proposals: UIProposal[] = []
    @observable
    metrics: Map<ProposalKey, ProposalQuality> = new Map<ProposalKey, ProposalQuality>()

    @observable
    active?: UIProposal

    @observable
    filter: ProposalFilter = {
        noAccessPolicy: true,
        quality: QualityLevel.HIGH,
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
            if (this.root.connection.status === ConnectionStatus.CONNECTED) {
                return
            }
            await this.fetchProposals()
            await this.fetchMetrics()
        }, proposalRefreshRate)
    }

    @action
    async fetchProposals(): Promise<void> {
        if (this.loading) {
            return
        }
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

    @action
    async fetchMetrics(): Promise<void> {
        if (this.loading) {
            return
        }
        this.setLoading(true)
        try {
            const metrics = await tequilapi.proposalsQuality()
            if (metrics.length) {
                this.setMetrics(metrics)
            }
        } catch (err) {
            console.log("Could not get metrics", err.message)
        }
        this.setLoading(false)
    }

    @computed
    get proposalsWithMetrics(): UIProposal[] {
        return this.proposals.map((proposal) => {
            const proposalMetrics = this.metrics.get(proposal.key)
            return { ...proposal, ...{ qualityLevel: qualityLevel(proposalMetrics) } }
        })
    }

    // #####################
    // Access policy filter (invisible yet)
    // #####################

    @computed
    get accessPolicyFiltered(): UIProposal[] {
        const input = this.proposalsWithMetrics
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
    // Quality filter
    // #####################

    @action
    setQualityFilter(quality?: QualityLevel): void {
        this.filter.quality = quality
    }

    @computed
    get qualityFiltered(): UIProposal[] {
        const input = this.textFiltered
        const filterQuality = this.filter.quality
        if (!filterQuality) {
            return input
        }
        return input.filter((p) => p.qualityLevel && p.qualityLevel >= filterQuality)
    }

    // #####################
    // IP type filter
    // #####################

    @computed
    get ipTypeCounts(): { [type: string]: number } {
        const input = this.qualityFiltered
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
        const input = this.qualityFiltered
        if (!this.filter.ipType) {
            return input
        }
        const ipType = (p: UIProposal): string | undefined => p.serviceDefinition.locationOriginate?.nodeType
        return input.filter((p) => ipType(p) === this.filter.ipType)
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
        return input.filter((p) => p.country == this.filter.country)
    }

    // #####################
    // Resulting list of proposals
    // #####################

    @computed
    get filteredProposals(): UIProposal[] {
        return this.countryFiltered.sort(compareProposal)
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

    @action
    setMetrics = (metrics: ProposalQuality[]): void => {
        for (const metric of metrics) {
            this.metrics.set(proposalKey(metric), metric)
        }
    }
}
