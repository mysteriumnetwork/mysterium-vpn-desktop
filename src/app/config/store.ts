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
import { log } from "../../shared/log/log"
import { DaemonStatusType } from "../daemon/store"
import { tequilapi } from "../tequilapi"
import { locations } from "../navigation/locations"

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
    onboarded?: boolean
    dns?: DNSOption
    filters?: ProposalFilters
}

export interface ProposalFilters {
    preset?: {
        id?: number | null
    }
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
            updateConfigPartial: action,
            persistConfig: action,
            persistConfigDebounced: action,

            currentTermsAgreed: computed,
            agreeToTerms: action,
            dnsOption: computed,
            setDnsOption: action,
            onboarded: computed,
            setOnboarded: action,
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

    updateConfigPartial = async (desktopConfig: DesktopConfig): Promise<void> => {
        this.config.desktop = _.merge({}, this.config.desktop, desktopConfig)
        return this.persistConfigDebounced()
    }

    persistConfig = async (): Promise<void> => {
        const cfg = this.config
        log.info("Persisting user configuration:", JSON.stringify(cfg))
        await tequilapi.updateUserConfig({
            data: cfg,
        })
    }

    persistConfigDebounced = _.debounce(this.persistConfig, 2_000)

    get currentTermsAgreed(): boolean {
        const version = this.config.desktop?.["terms-agreed"]?.version
        const at = this.config.desktop?.["terms-agreed"]?.at
        return !!version && !!at && version == termsPackageJson.version
    }

    agreeToTerms = async (): Promise<void> => {
        await this.updateConfigPartial({
            "terms-agreed": {
                version: termsPackageJson.version,
                at: new Date().toISOString(),
            },
        })
        if (this.onboarded) {
            this.root.navigation.goHome()
        } else {
            this.root.router.push(locations.onboardingIntro)
        }
    }

    get onboarded(): boolean {
        return this.config.desktop?.onboarded ?? false
    }

    setOnboarded = async (): Promise<void> => {
        return this.updateConfigPartial({ onboarded: true })
    }

    get dnsOption(): DNSOption {
        return this.config.desktop?.dns ?? "provider"
    }

    setDnsOption = async (dns: string): Promise<void> => {
        return this.updateConfigPartial({ dns })
    }
}
