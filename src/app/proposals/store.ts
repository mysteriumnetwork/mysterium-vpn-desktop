/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable, reaction, runInAction, when } from "mobx"
import { ConnectionStatus, ProposalQuery, QualityLevel } from "mysterium-vpn-js"
import * as _ from "lodash"
import { FilterPreset } from "mysterium-vpn-js"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { userEvent } from "../analytics/analytics"
import { log } from "../../shared/log/log"
import { ProposalFilters } from "../config/store"
import { tequilapi } from "../tequilapi"
import { ProposalViewAction } from "../../shared/analytics/actions"

import { compareProposal, newUIProposal, UIProposal } from "./ui-proposal-type"

const supportedServiceType = "wireguard"

const proposalRefreshRate = 30_000

export type TransientFilter = {
    text?: string
    country?: string
}

export class ProposalStore {
    loading = false
    proposals: UIProposal[] = []
    filterPresets: FilterPreset[] = []
    active?: UIProposal
    filter: TransientFilter = {}

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            loading: observable,
            proposals: observable,
            filterPresets: observable,
            active: observable,
            filter: observable,
            filters: computed,
            fetchProposals: action,
            fetchProposalFilterPresets: action,
            setTextFilter: action,
            textFiltered: computed,
            setPricePerHourMaxFilter: action,
            setPricePerHourMaxFilterDebounced: action,
            setPricePerGibMaxFilter: action,
            setPricePerGibMaxFilterDebounced: action,
            setQualityFilter: action,
            setIncludeFailed: action,
            countryCounts: computed,
            setCountryFilter: action,
            toggleCountryFilter: action,
            countryFiltered: computed,
            filteredProposals: computed,
            toggleActiveProposal: action,
            setLoading: action,
            setProposals: action,
        })
        this.root = root
    }

    setupReactions(): void {
        reaction(
            () => this.root.daemon.status,
            async (status) => {
                if (status == DaemonStatusType.Up && this.root.connection.status === ConnectionStatus.NOT_CONNECTED) {
                    when(
                        () => this.root.config.loaded,
                        () => {
                            this.fetchProposals()
                            this.fetchProposalFilterPresets()
                        },
                    )
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
        }, proposalRefreshRate)
    }

    get filters(): ProposalFilters {
        return this.root.filters.config
    }

    async fetchProposals(): Promise<void> {
        if (this.loading) {
            return
        }
        this.setLoading(true)
        try {
            const query: ProposalQuery = {
                serviceType: supportedServiceType,
            }
            query.presetId = this.filters.preset?.id ?? undefined
            query.qualityMin = this.filters.quality?.level
            query.priceGibMax = this.filters.price?.pergib
            query.priceHourMax = this.filters.price?.perhour
            const proposals = await tequilapi.findProposals(query).then((proposals) => proposals.map(newUIProposal))
            this.setProposals(proposals)
        } catch (err) {
            log.error("Could not get proposals", err.message)
        }
        this.setLoading(false)
    }

    async fetchProposalFilterPresets(): Promise<void> {
        const systemPresets = await tequilapi.proposalFilterPresets().then((res) => res.items)
        runInAction(() => {
            this.filterPresets = systemPresets.concat([{ id: 0, name: "All nodes" }])
        })
    }

    async toggleFilterPreset(id: number | null): Promise<void> {
        if (this.filters.preset?.id == id) {
            id = null
        }
        await this.root.filters.setPartial({ preset: { id } })
        await this.fetchProposals()
    }

    // #####################
    // Text filter
    // #####################

    setTextFilter(text?: string): void {
        this.filter.text = text
        this.setCountryFilter(undefined)
        userEvent(ProposalViewAction.FilterText, text)
    }

    get textFiltered(): UIProposal[] {
        const input = this.proposals
        const filterText = this.filter.text
        if (!filterText) {
            return input
        }
        return input.filter((p) => p.providerId.includes(filterText)).sort(compareProposal)
    }

    // #####################
    // Price filter
    // #####################

    async setPricePerHourMaxFilter(pricePerHourMax: number): Promise<void> {
        await this.root.filters.setPartial({
            price: {
                perhour: pricePerHourMax,
            },
        })
        await this.fetchProposals()
        userEvent(ProposalViewAction.FilterPriceTime, String(pricePerHourMax))
    }

    setPricePerHourMaxFilterDebounced = _.debounce(this.setPricePerHourMaxFilter, 800)

    async setPricePerGibMaxFilter(pricePerGibMax: number): Promise<void> {
        await this.root.filters.setPartial({
            price: {
                pergib: pricePerGibMax,
            },
        })
        await this.fetchProposals()
        userEvent(ProposalViewAction.FilterPriceData, String(pricePerGibMax))
    }

    setPricePerGibMaxFilterDebounced = _.debounce(this.setPricePerGibMaxFilter, 800)

    // #####################
    // Quality filter
    // #####################

    async setQualityFilter(level: QualityLevel): Promise<void> {
        await this.root.filters.setPartial({
            quality: { level },
        })
        await this.fetchProposals()
        userEvent(ProposalViewAction.FilterQuality, level ? QualityLevel[level] : undefined)
    }

    setIncludeFailed(includeFailed: boolean): void {
        this.root.filters.setPartial({
            quality: {
                "include-failed": includeFailed,
            },
        })
        userEvent(ProposalViewAction.FilterIncludeFailed, String(includeFailed))
    }

    // #####################
    // Country filter
    // #####################

    get countryCounts(): { [code: string]: number } {
        const input = this.textFiltered
        const result = _.groupBy(input, (p) => p.country)
        return _.mapValues(result, (ps) => ps.length)
    }

    async setCountryFilter(countryCode?: string): Promise<void> {
        this.filter.country = countryCode
    }

    toggleCountryFilter(countryCode?: string): void {
        this.setCountryFilter(this.filter.country !== countryCode ? countryCode : undefined)
        this.toggleActiveProposal(undefined)
        userEvent(ProposalViewAction.FilterCountry, countryCode)
    }

    get countryFiltered(): UIProposal[] {
        const input = this.textFiltered
        if (!this.filter.country) {
            return input
        }
        return input.filter((p) => p.country == this.filter.country)
    }

    // #####################
    // Resulting list of proposals
    // #####################

    get filteredProposals(): UIProposal[] {
        return this.countryFiltered.slice().sort(compareProposal)
    }

    priceTier = (p: UIProposal): number => {
        const perGibMax = this.root.filters.priceCeiling?.perGibMax ?? 0
        if (p.price.perGib > perGibMax * 0.75) {
            return 3
        }
        if (p.price.perGib > perGibMax * 0.25) {
            return 2
        }
        if (p.price.perGib > 0) {
            return 1
        }
        return 0
    }

    // #####################
    // End of filters
    // #####################

    toggleActiveProposal(proposal?: UIProposal): void {
        this.active = this.active?.key !== proposal?.key ? proposal : undefined
        userEvent(ProposalViewAction.SelectProposal, proposal?.country)
    }

    setLoading = (b: boolean): void => {
        this.loading = b
    }

    setProposals = (proposals: UIProposal[]): void => {
        this.proposals = proposals
    }
}
