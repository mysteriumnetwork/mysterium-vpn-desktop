/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx"
import { DNSOption, QualityLevel } from "mysterium-vpn-js"
import * as termsPackageJson from "@mysteriumnetwork/terms/package.json"
import * as _ from "lodash"

import { RootStore } from "../store"
import { log } from "../log/log"
import { DaemonStatusType } from "../daemon/store"
import { tequilapi } from "../tequilapi"

export interface Config {
    desktop: DesktopConfig
    payments?: {
        consumer?: {
            "price-gib-max"?: number
            "price-hour-max"?: number
        }
    }
}

export interface DesktopConfig {
    "terms-agreed"?: {
        at?: string
        version?: string
    }
    dns?: DNSOption
    filters?: ProposalFilters
}

export interface ProposalFilters {
    price?: {
        pergib?: number
        perhour?: number
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
    perHourMax: number
    perGibMax: number
}

export class ConfigStore {
    config: Config = { desktop: {} }
    loaded = false
    defaultConfig: Config = { desktop: {} }

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        makeObservable(this, {
            config: observable,
            loaded: observable,
            defaultConfig: observable,
            fetchConfig: action,
            agreeToTerms: action,
            setDnsOption: action,
            dnsOption: computed,
            persistConfig: action,
            setPartial: action,
        })
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
    }

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
        runInAction(() => {
            this.loaded = true
        })
    }

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
        this.root.navigation.goHome()
    }

    currentTermsAgreed = (): boolean => {
        const version = this.config.desktop?.["terms-agreed"]?.version
        const at = this.config.desktop?.["terms-agreed"]?.at
        return !!version && !!at && version == termsPackageJson.version
    }

    setDnsOption = async (value: string): Promise<void> => {
        await tequilapi.updateUserConfig({
            data: { "desktop.dns": value },
        })
        await this.fetchConfig()
    }

    get dnsOption(): DNSOption {
        return this.config.desktop?.dns ?? "1.1.1.1"
    }

    persistConfig = _.debounce(async () => {
        const cfg = this.config
        log.info("Persisting user configuration:", JSON.stringify(cfg))
        await tequilapi.updateUserConfig({
            data: cfg,
        })
        await this.fetchConfig()
    }, 3_000)

    setPartial = async (desktopConfig: DesktopConfig): Promise<void> => {
        this.config.desktop = _.merge({}, this.config.desktop, desktopConfig)
        this.persistConfig()
    }
}
