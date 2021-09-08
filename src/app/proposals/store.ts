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
import { logErrorMessage } from "../../shared/log/log"
import { PriceCeiling, ProposalFilters } from "../config/store"
import { tequilapi } from "../tequilapi"
import { ProposalViewAction } from "../../shared/analytics/actions"
import { parseError } from "../../shared/errors/parseError"

import { compareProposal, newUIProposal, UIProposal } from "./uiProposal"

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
            setQualityFilter: action,
            setIncludeFailed: action,
            countryCounts: computed,
            setCountryFilter: action,
            toggleCountryFilter: action,
            countryFiltered: computed,
            filteredProposals: computed,
            priceCeil: computed,
            toggleActiveProposal: action,
            setActiveProposal: action,
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
                    setTimeout(() => {
                        this.fetchProposals()
                    }, 8_000)
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
        await this.root.filters.setPartial({
            other: {
                country: countryCode,
            },
        })
    }

    toggleCountryFilter(countryCode?: string): void {
        this.setCountryFilter(this.root.filters.country !== countryCode ? countryCode : undefined)
        this.toggleActiveProposal(undefined)
        userEvent(ProposalViewAction.FilterCountry, countryCode)
    }

    get countryFiltered(): UIProposal[] {
        const input = this.textFiltered
        const country = this.root.filters.country
        if (!country) {
            return input
        }
        return input.filter((p) => p.country == country)
    }

    // #####################
    // Resulting list of proposals
    // #####################

    get filteredProposals(): UIProposal[] {
        return this.countryFiltered.slice().sort(compareProposal)
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
        userEvent(ProposalViewAction.SelectProposal, proposal?.country)
    }

    setActiveProposal(proposal?: UIProposal): void {
        this.active = proposal
        userEvent(ProposalViewAction.SelectProposal, proposal?.country)
    }

    setLoading = (b: boolean): void => {
        this.loading = b
    }

    setProposals = (proposals: UIProposal[]): void => {
        this.proposals = proposals
    }
}
