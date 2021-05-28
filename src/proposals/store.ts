/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, reaction, when } from "mobx"
import { ConnectionStatus, QualityLevel } from "mysterium-vpn-js"
import * as _ from "lodash"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { userEvent } from "../analytics/analytics"
import { log } from "../log/log"
import { ProposalFilters } from "../config/store"
import { tequilapi } from "../tequilapi"
import { ProposalViewAction } from "../analytics/actions"

import { compareProposal, newUIProposal, UIProposal } from "./ui-proposal-type"

const supportedServiceType = "wireguard"

const proposalRefreshRate = 30_000

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
    active?: UIProposal

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
                    when(
                        () => this.root.config.loaded,
                        () => this.fetchProposals(),
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

    @computed
    get filters(): ProposalFilters {
        return this.root.filters.config
    }

    @action
    async fetchProposals(): Promise<void> {
        if (this.loading) {
            return
        }
        this.setLoading(true)
        try {
            const query = {
                serviceType: supportedServiceType,
                ipType: this.root.filters.config.other?.["ip-type"],
                qualityMin: this.root.filters.config.quality?.level,
                priceGibMax: this.root.filters.config.price?.pergib,
                priceHourMax: this.root.filters.config.price?.perhour,
            }
            const proposals = await tequilapi.findProposals(query).then((proposals) => proposals.map(newUIProposal))
            this.setProposals(proposals)
        } catch (err) {
            log.error("Could not get proposals", err.message)
        }
        this.setLoading(false)
    }

    // #####################
    // Text filter
    // #####################

    @action
    setTextFilter(text?: string): void {
        this.filter.text = text
        this.setCountryFilter(undefined)
        userEvent(ProposalViewAction.FilterText, text)
    }

    @computed
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

    @action
    async setPricePerHourMaxFilter(pricePerHourMax: number): Promise<void> {
        await this.root.filters.setPartial({
            price: {
                perhour: pricePerHourMax,
            },
        })
        await this.fetchProposals()
        userEvent(ProposalViewAction.FilterPriceTime, String(pricePerHourMax))
    }

    @action
    setPricePerHourMaxFilterDebounced = _.debounce(this.setPricePerHourMaxFilter, 800)

    @action
    async setPricePerGibMaxFilter(pricePerGibMax: number): Promise<void> {
        await this.root.filters.setPartial({
            price: {
                pergib: pricePerGibMax,
            },
        })
        await this.fetchProposals()
        userEvent(ProposalViewAction.FilterPriceData, String(pricePerGibMax))
    }

    @action
    setPricePerGibMaxFilterDebounced = _.debounce(this.setPricePerGibMaxFilter, 800)

    // #####################
    // Quality filter
    // #####################

    @action
    async setQualityFilter(level: QualityLevel): Promise<void> {
        await this.root.filters.setPartial({
            quality: { level },
        })
        await this.fetchProposals()
        userEvent(ProposalViewAction.FilterQuality, level ? QualityLevel[level] : undefined)
    }

    @action
    setIncludeFailed(includeFailed: boolean): void {
        this.root.filters.setPartial({
            quality: {
                "include-failed": includeFailed,
            },
        })
        userEvent(ProposalViewAction.FilterIncludeFailed, String(includeFailed))
    }

    // #####################
    // IP type filter
    // #####################

    @computed
    get ipTypeCounts(): { [type: string]: number } {
        const input = this.proposals
        const result = _.groupBy(input, (p) => p.ipType)
        return _.mapValues(result, (ps) => ps.length)
    }

    @action
    async setIpTypeFilter(ipType?: string): Promise<void> {
        await this.root.filters.setPartial({
            other: {
                "ip-type": ipType,
            },
        })
        await this.fetchProposals()
    }

    @action
    toggleIpTypeFilter(ipType?: string): void {
        this.setIpTypeFilter(this.filters.other?.["ip-type"] !== ipType ? ipType : "")
        userEvent(ProposalViewAction.FilterIpType, ipType)
    }

    // #####################
    // Country filter
    // #####################

    @computed
    get countryCounts(): { [code: string]: number } {
        const input = this.textFiltered
        const result = _.groupBy(input, (p) => p.country)
        return _.mapValues(result, (ps) => ps.length)
    }

    @action
    async setCountryFilter(countryCode?: string): Promise<void> {
        this.filter.country = countryCode
    }

    @action
    toggleCountryFilter(countryCode?: string): void {
        this.setCountryFilter(this.filter.country !== countryCode ? countryCode : undefined)
        this.toggleActiveProposal(undefined)
        userEvent(ProposalViewAction.FilterCountry, countryCode)
    }

    @computed
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

    @computed
    get filteredProposals(): UIProposal[] {
        return this.countryFiltered.slice().sort(compareProposal)
    }

    // #####################
    // End of filters
    // #####################

    @action
    toggleActiveProposal(proposal?: UIProposal): void {
        this.active = this.active?.key !== proposal?.key ? proposal : undefined
        userEvent(ProposalViewAction.SelectProposal, proposal?.country)
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
