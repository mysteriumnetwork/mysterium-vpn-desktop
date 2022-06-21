/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable, runInAction, toJS } from "mobx"
import { DNSOption, QualityLevel } from "mysterium-vpn-js"
import * as termsPackageJson from "@mysteriumnetwork/terms/package.json"
import * as _ from "lodash"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { log } from "../../shared/log/log"
import { tequilapi } from "../tequilapi"
import { MainIpcListenChannels } from "../../shared/ipc"

export interface Config {
    desktop: DesktopConfig
    payments?: {
        consumer?: {
            "price-gib-max"?: number
            "price-hour-max"?: number
        }
    }
    "keep-connected-on-fail"?: boolean
}

export interface DesktopConfig {
    "terms-agreed"?: {
        at?: string
        version?: string
    }
    onboarded?: boolean
    dns?: DNSOption
    "nat-compatibility"?: "auto" | "off"
    "quick-connect"?: boolean
    filters?: ProposalFilters
}

export interface ProposalFilters {
    preset?: {
        id?: number | null
    }
    quality?: {
        "include-failed"?: boolean
        level?: QualityLevel
    }
    other?: {
        country?: string | null
    }
}

export interface PriceCeiling {
    perGibMax: number
}

export class ConfigStore {
    config: Config = { desktop: {} }
    loaded = false

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
        makeObservable(this, {
            config: observable,
            loaded: observable,
            loadConfig: action,
            updateDesktopConfigPartial: action,
            updateNodeConfigPartial: action,
            persistConfig: action,

            currentTermsAgreed: computed,
            agreeToTerms: action,
            dnsOption: computed,
            setDnsOption: action,
            autoNATCompatibility: computed,
            setAutoNATCompatibility: action,
            onboarded: computed,
            setOnboarded: action,
            quickConnect: computed,
            setQuickConnect: action,
            killSwitch: computed,
            setKillSwitch: action,
        })
    }

    loadConfig = async (): Promise<void> => {
        const config = await tequilapi.userConfig()
        runInAction(() => {
            this.config = {
                desktop: {},
                ...config.data,
            }
            log.info("Using config:", JSON.stringify(this.config))
        })
        runInAction(() => {
            this.loaded = true
        })
    }

    updateDesktopConfigPartial = async (desktopConfig: DesktopConfig): Promise<void> => {
        this.config.desktop = _.merge({}, this.config.desktop, desktopConfig)
        return this.persistConfig()
    }

    updateNodeConfigPartial = async (config: Partial<Config>): Promise<void> => {
        this.config = _.merge({}, this.config, config)
        return this.persistConfig()
    }

    // Offload to main
    persistConfig = async (): Promise<void> => {
        ipcRenderer.send(MainIpcListenChannels.SaveUserConfig, toJS(this.config))
    }

    get currentTermsAgreed(): boolean {
        const version = this.config.desktop?.["terms-agreed"]?.version
        const at = this.config.desktop?.["terms-agreed"]?.at
        return !!version && !!at && version == termsPackageJson.version
    }

    agreeToTerms = async (): Promise<void> => {
        await this.updateDesktopConfigPartial({
            "terms-agreed": {
                version: termsPackageJson.version,
                at: new Date().toISOString(),
            },
        })
    }

    get onboarded(): boolean {
        return this.config.desktop?.onboarded ?? false
    }

    setOnboarded = async (): Promise<void> => {
        return this.updateDesktopConfigPartial({ onboarded: true })
    }

    get dnsOption(): DNSOption {
        return this.config.desktop?.dns ?? "provider"
    }

    setDnsOption = async (dns: string): Promise<void> => {
        return this.updateDesktopConfigPartial({ dns })
    }

    get autoNATCompatibility(): boolean {
        return this.config.desktop?.["nat-compatibility"] !== "off"
    }

    setAutoNATCompatibility = async (enabled: boolean): Promise<void> => {
        return this.updateDesktopConfigPartial({ "nat-compatibility": enabled ? "auto" : "off" })
    }

    get quickConnect(): boolean {
        return this.config.desktop?.["quick-connect"] !== false
    }

    setQuickConnect = async (enabled: boolean): Promise<void> => {
        return this.updateDesktopConfigPartial({ "quick-connect": enabled })
    }

    get killSwitch(): boolean {
        return this.config["keep-connected-on-fail"] === true
    }

    setKillSwitch = async (enabled: boolean): Promise<void> => {
        return this.updateNodeConfigPartial({
            "keep-connected-on-fail": enabled,
        })
    }
}
