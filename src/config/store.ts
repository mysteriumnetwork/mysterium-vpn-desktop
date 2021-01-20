/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, reaction, runInAction } from "mobx"
import tequilapi, { DNSOption, QualityLevel } from "mysterium-vpn-js"
import * as termsPackageJson from "@mysteriumnetwork/terms/package.json"
import * as _ from "lodash"

import { RootStore } from "../store"
import { log } from "../log/log"
import { DaemonStatusType } from "../daemon/store"

export interface Config {
    desktop: {
        "terms-agreed"?: {
            at?: string
            version?: string
        }
        dns?: DNSOption
        filters?: ProposalFilters
    }
    payments?: {
        consumer?: {
            "price-pergib-max"?: number
            "price-perminute-max"?: number
        }
    }
}

export interface ProposalFilters {
    price?: {
        pergib?: number
        perminute?: number
    }
    quality?: {
        "include-failed"?: boolean
        level?: QualityLevel
    }
    other?: {
        country?: string
        "no-access-policy"?: boolean
        "ip-type"?: string
    }
}

export interface PriceCeiling {
    perMinuteMax: number
    perGibMax: number
}

export class ConfigStore {
    @observable
    config: Config = { desktop: {} }
    @observable
    defaultConfig: Config = { desktop: {} }

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        reaction(
            () => this.root.daemon.status,
            async (status) => {
                if (status == DaemonStatusType.Up) {
                    await this.fetchConfig()
                    this.root.navigation.determineRoute()
                }
            },
        )
        reaction(
            () => [this.config, this.defaultConfig],
            async ([config, defaultConfig]) => {
                if (config.desktop.filters?.price?.perminute == null) {
                    // apply default filters
                    this.resetFilters()
                    return
                }
                if (defaultConfig.payments?.consumer?.["price-perminute-max"] == null) {
                    // default config not loaded yet
                    return
                }
                const perMinute = config.desktop.filters?.price?.perminute || 0
                const perGib = config.desktop.filters?.price?.pergib || 0
                if (perMinute > this.priceCeiling.perMinuteMax || perGib > this.priceCeiling.perGibMax) {
                    log.info("Configured prices are outside maximum range, resetting filters...")
                    this.resetFilters()
                }
            },
        )
    }

    @action
    fetchConfig = async (): Promise<void> => {
        const [config, defaultConfig] = await Promise.all([tequilapi.userConfig(), tequilapi.defaultConfig()])
        runInAction(() => {
            this.config = {
                desktop: {},
                ...config.data,
            }
            log.info("Using config:", JSON.stringify(this.config))
        })
        runInAction(() => {
            this.defaultConfig = {
                desktop: {},
                ...defaultConfig.data,
            }
            log.info("Default node config:", JSON.stringify(this.defaultConfig))
        })
    }

    @action
    agreeToTerms = async (): Promise<void> => {
        const data: Config = {
            ...this.config,
            desktop: {
                "terms-agreed": {
                    version: termsPackageJson.version,
                    at: new Date().toISOString(),
                },
            },
        }
        await tequilapi.updateUserConfig({ data })
        await this.fetchConfig()
        this.root.navigation.determineRoute()
    }

    currentTermsAgreed = (): boolean => {
        const version = this.config.desktop?.["terms-agreed"]?.version
        const at = this.config.desktop?.["terms-agreed"]?.at
        return !!version && !!at && version == termsPackageJson.version
    }

    @action
    setDnsOption = async (value: string): Promise<void> => {
        await tequilapi.updateUserConfig({
            data: { "desktop.dns": value },
        })
        await this.fetchConfig()
    }

    @computed
    get dnsOption(): DNSOption {
        return this.config.desktop?.dns ?? "1.1.1.1"
    }

    @computed
    get priceCeiling(): PriceCeiling {
        return {
            perMinuteMax: this.defaultConfig.payments?.consumer?.["price-perminute-max"] || 0,
            perGibMax: this.defaultConfig.payments?.consumer?.["price-pergib-max"] || 0,
        }
    }

    @action
    persistConfig = _.debounce(async () => {
        const cfg = this.config
        log.info("Persisting user configuration:", JSON.stringify(cfg))
        await tequilapi.updateUserConfig({
            data: cfg,
        })
        await this.fetchConfig()
    }, 3_000)

    @computed
    get filters(): ProposalFilters {
        return this.config.desktop?.filters || {}
    }

    @computed
    get defaultFilters(): ProposalFilters {
        const ceil = this.priceCeiling
        return {
            price: {
                perminute: ceil ? ceil.perMinuteMax / 2 : undefined,
                pergib: ceil ? ceil.perGibMax / 2 : undefined,
            },
            quality: {
                level: QualityLevel.HIGH,
                "include-failed": false,
            },
            other: {
                "no-access-policy": true,
            },
        }
    }

    @action
    setFiltersPartial = async (filters: ProposalFilters): Promise<void> => {
        this.config.desktop.filters = _.merge({}, this.config.desktop.filters, filters)
        this.persistConfig()
    }

    @action
    resetFilters = async (): Promise<void> => {
        if (!this.config.desktop) {
            this.config.desktop = {}
        }
        this.config.desktop.filters = this.defaultFilters
        this.persistConfig()
    }
}
