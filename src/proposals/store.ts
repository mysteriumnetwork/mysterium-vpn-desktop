/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, observe, reaction, toJS } from "mobx"
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
import { loadJSON, storeJSON } from "../storage/local-storage"
import { PricesCeiling } from "../config/store"

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

export type ProposalFilter = {
    noAccessPolicy?: boolean
    text?: string
    pricePerMinute: number
    pricePerGib: number
    quality: QualityLevel
    includeFailed: boolean
    ipType?: string
    country?: string
    createdOn: Date
}

const defaultProposalFilter = (c: PricesCeiling): ProposalFilter => {
    return {
        noAccessPolicy: true,
        pricePerMinute: c.perMinuteMax / 2,
        pricePerGib: c.perGibMax / 2,
        quality: QualityLevel.HIGH,
        includeFailed: false,
        createdOn: new Date(),
    }
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
    filter: ProposalFilter

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        this.filter = loadJSON<ProposalFilter>("proposalFilter", () =>
            defaultProposalFilter(this.root.config.pricesCeiling),
        )
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
        observe(this.filter, (a) => {
            const updatedFilter = toJS<ProposalFilter>(a.object)
            storeJSON("proposalFilter", updatedFilter)
        })
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
        this.filter.pricePerMinute = pricePerMinuteMax
        analytics.event(Category.Proposal, ProposalAction.PriceFilterPerMinute, String(pricePerMinuteMax))
    }
    @action
    setPricePerGibMaxFilter(pricePerGibMax: number): void {
        this.filter.pricePerGib = pricePerGibMax
        analytics.event(Category.Proposal, ProposalAction.PriceFilterPerGib, String(pricePerGibMax))
    }

    @computed
    get priceMaximums(): { perMinuteMax: number; perGibMax: number } {
        return { perMinuteMax: 0.001 * decimalPart(), perGibMax: 1.0 * decimalPart() }
    }

    @computed
    get toleratedPrices(): { perMinuteMax?: number; perGibMax?: number } {
        const tolerance = 0.000005 * decimalPart()
        let perMinuteMax
        const filterPricePerMinuteMax = this.filter.pricePerMinute
        if (filterPricePerMinuteMax !== undefined) {
            perMinuteMax = filterPricePerMinuteMax + (filterPricePerMinuteMax !== 0 ? tolerance : 0)
        }
        let perGibMax
        const filterPricePerGibMax = this.filter.pricePerGib
        if (filterPricePerGibMax !== undefined) {
            perGibMax = filterPricePerGibMax + (filterPricePerGibMax !== 0 ? tolerance : 0)
        }
        return { perMinuteMax, perGibMax }
    }

    @computed
    get priceFiltered(): UIProposal[] {
        const input = this.textFiltered
        const filterPricePerMinuteMax = this.filter.pricePerMinute ?? 0
        const filterPricePerGibMax = this.filter.pricePerGib ?? 0
        if (!filterPricePerMinuteMax && !filterPricePerGibMax) {
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
    setQualityFilter(quality: QualityLevel): void {
        this.filter.quality = quality
        analytics.event(
            Category.Proposal,
            ProposalAction.QualityFilterLevel,
            quality ? QualityLevel[quality] : undefined,
        )
    }

    @action
    setIncludeFailed(includeFailed: boolean): void {
        this.filter.includeFailed = includeFailed
        analytics.event(Category.Proposal, ProposalAction.QualityFilterIncludeUnreachable, String(includeFailed))
    }

    @computed
    get qualityFiltered(): UIProposal[] {
        const input = this.priceFiltered
        const filterQuality = this.filter.quality
        const filterIncludeFailed = this.filter.includeFailed
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
        this.filter.ipType = ipType
        this.setCountryFilter(undefined)
    }

    @action
    toggleIpTypeFilter(ipType?: string): void {
        this.setIpTypeFilter(this.filter.ipType !== ipType ? ipType : undefined)
        analytics.event(Category.Proposal, ProposalAction.IpTypeFilter, ipType)
    }

    @computed
    get ipTypeFiltered(): UIProposal[] {
        const input = this.qualityFiltered
        if (!this.filter.ipType) {
            return input
        }
        return input.filter((p) => p.nodeType === this.filter.ipType)
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

    @action
    resetFiltersToDefaults = (): void => {
        this.filter = defaultProposalFilter(this.root.config.pricesCeiling)
    }
}
