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
import { logErrorMessage } from "../../shared/log/log"
import { PriceCeiling, ProposalFilters } from "../config/store"
import { tequilapi } from "../tequilapi"
import { parseError } from "../../shared/errors/parseError"

import { compareProposal, newUIProposal, UIProposal } from "./uiProposal"

const supportedServiceType = "wireguard"

const proposalRefreshRate = 30_000

type Dict = _.Dictionary<UIProposal[]>
type CountryCounts = { [code: string]: number }

export class ProposalStore {
    loading = false
    proposalsCurrent: UIProposal[] = []

    proposalsAll: UIProposal[] = []
    proposalsByCountry: Dict = {}
    countryCounts: CountryCounts = {}

    proposalsAllPresetsForQuickSearch: UIProposal[] = []

    filterPresets: FilterPreset[] = []
    active?: UIProposal
    suggestion?: UIProposal

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            loading: observable,
            proposalsCurrent: observable.ref,
            countryCounts: observable.ref,
            proposalsAllPresetsForQuickSearch: observable.ref,
            filterPresets: observable.ref,
            active: observable.ref,
            suggestion: observable.ref,
            filters: computed,
            fetchProposals: action,
            fetchAllProposalsForQuickSearch: action,
            prepareForQuickSearch: action,
            fetchProposalFilterPresets: action,
            setQualityFilter: action,
            setIncludeFailed: action,
            setCountryFilter: action,
            toggleCountryFilter: action,
            filteredProposals: computed,
            priceCeil: computed,
            toggleActiveProposal: action,
            setActiveProposal: action,
            useQuickSearchSuggestion: action,
            setLoading: action,
            setProposals: action,
            setProposalsCurrent: action,
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
                            this.fetchProposals().then(() => {
                                this.setProposalsCurrent()
                            })
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
            query.natCompatibility = this.root.config.autoNATCompatibility ? this.root.connection.natType : undefined
            const proposals = await tequilapi.findProposals(query).then((proposals) => proposals.map(newUIProposal))
            this.setProposals(proposals)
        } catch (err) {
            const msg = parseError(err)
            logErrorMessage("Could not get proposals", msg)
        }
        this.setLoading(false)
    }

    async fetchProposalFilterPresets(): Promise<void> {
        let systemPresets: FilterPreset[] = []
        try {
            const res = await tequilapi.proposalFilterPresets()
            systemPresets = res.items
        } catch (err) {
            const msg = parseError(err)
            logErrorMessage("Could not get proposal filter presets", msg)
        }
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
        this.setProposalsCurrent()
    }

    // #####################
    // Quality filter
    // #####################

    async setQualityFilter(level: QualityLevel): Promise<void> {
        await this.root.filters.setPartial({
            quality: { level },
        })
        await this.fetchProposals()
    }

    setIncludeFailed(includeFailed: boolean): void {
        this.root.filters.setPartial({
            quality: {
                "include-failed": includeFailed,
            },
        })
    }

    // #####################
    // Country filter
    // #####################

    async setCountryFilter(countryCode?: string): Promise<void> {
        await this.root.filters.setPartial({
            other: {
                country: countryCode ?? null,
            },
        })
        requestIdleCallback(() => {
            this.setProposalsCurrent()
        })
    }

    toggleCountryFilter(countryCode?: string): void {
        this.setCountryFilter(this.root.filters.country !== countryCode ? countryCode : undefined)
        this.toggleActiveProposal(undefined)
    }

    // #####################
    // Resulting list of proposals
    // #####################

    get filteredProposals(): UIProposal[] {
        return this.proposalsCurrent
    }

    get priceCeil(): PriceCeiling {
        return {
            perGibMax: Math.max(...this.filteredProposals.map((p) => p.price.perGib)),
        }
    }

    priceTier = (p: UIProposal): number => {
        const perGibMax = this.priceCeil?.perGibMax ?? 0
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
    }

    setActiveProposal(proposal?: UIProposal): void {
        this.active = proposal
    }

    async prepareForQuickSearch(): Promise<void> {
        if (this.filters.preset?.id) {
            this.toggleFilterPreset(0)
        }
        return this.fetchAllProposalsForQuickSearchDebounced()
    }

    fetchAllProposalsForQuickSearchDebounced = _.throttle(this.fetchAllProposalsForQuickSearch, 60_000)

    async fetchAllProposalsForQuickSearch(): Promise<void> {
        const allProposals = await tequilapi
            .findProposals({
                includeMonitoringFailed: true,
            })
            .then((proposals) => proposals.map(newUIProposal))
        runInAction(() => {
            this.proposalsAllPresetsForQuickSearch = allProposals
        })
    }

    async useQuickSearchSuggestion(proposal?: UIProposal): Promise<void> {
        await this.setCountryFilter(proposal?.country)
        runInAction(() => (this.active = proposal))
        runInAction(() => (this.suggestion = proposal))
    }

    setLoading = (b: boolean): void => {
        this.loading = b
    }

    setProposals = (proposals: UIProposal[]): void => {
        proposals = proposals.sort(compareProposal)
        this.proposalsAll = proposals
        this.proposalsByCountry = _.groupBy(proposals, "country")
        // observable
        this.countryCounts = _.mapValues(this.proposalsByCountry, (ps) => ps.length)
    }

    setProposalsCurrent = (): void => {
        const country = this.root.filters.country
        this.proposalsCurrent = country ? this.proposalsByCountry[country] ?? [] : this.proposalsAll
    }
}
