/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, reaction } from "mobx"
import tequilapi, {
    ConnectionStatus,
    pricePerGiB,
    pricePerMinute,
    ProposalMetrics,
    QualityCalculator,
    QualityLevel,
} from "mysterium-vpn-js"
import * as _ from "lodash"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { analytics } from "../analytics/analytics-ui"
import { Category, ProposalAction } from "../analytics/analytics"
import { log } from "../log/log"
import { decimalPart } from "../payment/display"
import { ProposalFilters } from "../config/store"

import { compareProposal, newUIProposal, ProposalKey, proposalKey, UIProposal } from "./ui-proposal-type"

const qc = new QualityCalculator()

const qualityLevel = (metrics?: ProposalMetrics): QualityLevel | undefined => {
    if (!metrics) {
        return QualityLevel.UNKNOWN
    }
    const qualityValue = qc.calculateValue(metrics)
    return qc.calculateLevel(qualityValue)
}

const supportedServiceType = "wireguard"

const proposalRefreshRate = 10000

export type TransientFilter = {
    text?: string
    country?: string
}

export class ProposalStore {
    @observable
    loading = false
    @observable
    proposals: UIProposal[] = []
    @observable
    metrics: Map<ProposalKey, ProposalMetrics> = new Map<ProposalKey, ProposalMetrics>()

    @observable
    active?: UIProposal

    @observable
    customFilter = false

    @observable
    filter: TransientFilter = {}

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

    @computed
    get configFilters(): ProposalFilters {
        return this.root.config.filters
    }

    @action
    async fetchProposals(): Promise<void> {
        if (this.loading) {
            return
        }
        this.setLoading(true)
        try {
            const proposals = await tequilapi
                .findProposals({ serviceType: supportedServiceType })
                .then((proposals) => proposals.map(newUIProposal))
            this.setProposals(proposals)
        } catch (err) {
            log.error("Could not get proposals", err.message)
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
            log.error("Could not get metrics", err.message)
        }
        this.setLoading(false)
    }

    @computed
    get proposalsWithMetrics(): UIProposal[] {
        return this.proposals.map((proposal) => {
            const proposalMetrics = this.metrics.get(proposal.key)
            return {
                ...proposal,
                metrics: proposalMetrics,
                ...{ qualityLevel: qualityLevel(proposalMetrics) },
            }
        })
    }

    @action
    toggleCustomFilter(): void {
        const newVal = !this.customFilter
        this.customFilter = newVal
        analytics.event(Category.Proposal, ProposalAction.CustomFilter, String(newVal))
    }

    // #####################
    // Access policy filter (invisible yet)
    // #####################

    @computed
    get accessPolicyFiltered(): UIProposal[] {
        const input = this.proposalsWithMetrics
        if (!this.configFilters.other?.["no-access-policy"]) {
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
        this.setCountryFilter(undefined)
        analytics.event(Category.Proposal, ProposalAction.TextFilter)
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
    // Price filter
    // #####################

    @action
    setPricePerMinuteMaxFilter(pricePerMinuteMax: number): void {
        this.root.config.setFiltersPartial({
            price: {
                perminute: pricePerMinuteMax,
            },
        })
        analytics.event(Category.Proposal, ProposalAction.PriceFilterPerMinute, String(pricePerMinuteMax))
    }

    @action
    setPricePerMinuteMaxFilterDebounced = _.debounce(this.setPricePerMinuteMaxFilter, 800)

    @action
    setPricePerGibMaxFilter(pricePerGibMax: number): void {
        this.root.config.setFiltersPartial({
            price: {
                pergib: pricePerGibMax,
            },
        })
        analytics.event(Category.Proposal, ProposalAction.PriceFilterPerGib, String(pricePerGibMax))
    }

    @action
    setPricePerGibMaxFilterDebounced = _.debounce(this.setPricePerGibMaxFilter, 800)

    @computed
    get toleratedPrices(): { perMinuteMax?: number; perGibMax?: number } {
        const tolerance = 0.000005 * decimalPart()
        let perMinuteMax
        const filterPricePerMinuteMax = this.configFilters.price?.perminute
        if (filterPricePerMinuteMax !== undefined) {
            perMinuteMax = filterPricePerMinuteMax + (filterPricePerMinuteMax !== 0 ? tolerance : 0)
        }
        let perGibMax
        const filterPricePerGibMax = this.configFilters.price?.pergib
        if (filterPricePerGibMax !== undefined) {
            perGibMax = filterPricePerGibMax + (filterPricePerGibMax !== 0 ? tolerance : 0)
        }
        return { perMinuteMax, perGibMax }
    }

    @computed
    get priceFiltered(): UIProposal[] {
        const input = this.textFiltered
        const filterPricePerMinuteMax = this.configFilters.price?.perminute
        const filterPricePerGibMax = this.configFilters.price?.pergib
        if (filterPricePerMinuteMax == null && filterPricePerGibMax == null) {
            return input
        }
        return input.filter((p) => {
            const pricePerMin = pricePerMinute(p.paymentMethod)
            const pricePerGib = pricePerGiB(p.paymentMethod)
            const tolerated = this.toleratedPrices
            return (
                (tolerated.perMinuteMax === undefined || pricePerMin.amount <= tolerated.perMinuteMax) &&
                (tolerated.perGibMax === undefined || pricePerGib.amount <= tolerated.perGibMax)
            )
        })
    }

    // #####################
    // Quality filter
    // #####################

    @action
    setQualityFilter(level: QualityLevel): void {
        this.root.config.setFiltersPartial({
            quality: { level },
        })
        analytics.event(Category.Proposal, ProposalAction.QualityFilterLevel, level ? QualityLevel[level] : undefined)
    }

    @action
    setIncludeFailed(includeFailed: boolean): void {
        this.root.config.setFiltersPartial({
            quality: {
                "include-failed": includeFailed,
            },
        })
        analytics.event(Category.Proposal, ProposalAction.QualityFilterIncludeUnreachable, String(includeFailed))
    }

    @computed
    get qualityFiltered(): UIProposal[] {
        const input = this.priceFiltered
        const filterQuality = this.configFilters.quality?.level
        const filterIncludeFailed = this.configFilters.quality?.["include-failed"]
        if (!filterQuality && !filterIncludeFailed) {
            return input
        }
        return input.filter((p) => {
            if (filterQuality && p.qualityLevel && p.qualityLevel < filterQuality) {
                return false
            }
            if (!filterIncludeFailed && p.metrics?.monitoringFailed) {
                return false
            }
            return true
        })
    }

    // #####################
    // IP type filter
    // #####################

    @computed
    get ipTypeCounts(): { [type: string]: number } {
        const input = this.qualityFiltered
        const result = _.groupBy(input, (p) => p.nodeType)
        return _.mapValues(result, (ps) => ps.length)
    }

    @action
    setIpTypeFilter(ipType?: string): void {
        this.root.config.setFiltersPartial({
            other: {
                "ip-type": ipType,
            },
        })
        this.setCountryFilter(undefined)
    }

    @action
    toggleIpTypeFilter(ipType?: string): void {
        this.setIpTypeFilter(this.configFilters.other?.["ip-type"] !== ipType ? ipType : "")
        analytics.event(Category.Proposal, ProposalAction.IpTypeFilter, ipType)
    }

    @computed
    get ipTypeFiltered(): UIProposal[] {
        const input = this.qualityFiltered
        if (!this.root.config.config.desktop.filters?.other?.["ip-type"]) {
            return input
        }
        return input.filter((p) => p.nodeType === this.configFilters.other?.["ip-type"])
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
        analytics.event(Category.Proposal, ProposalAction.CountryFilter, countryCode)
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

    @action
    toggleActiveProposal(proposal?: UIProposal): void {
        this.active = this.active?.key !== proposal?.key ? proposal : undefined
        analytics.event(Category.Proposal, ProposalAction.SelectProposal, proposal?.country)
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
    setMetrics = (metrics: ProposalMetrics[]): void => {
        for (const metric of metrics) {
            this.metrics.set(proposalKey(metric), metric)
        }
    }
}
