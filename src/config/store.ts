/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, reaction, runInAction } from "mobx"
import tequilapi, { DNSOption } from "mysterium-vpn-js"
import * as termsPackageJson from "@mysteriumnetwork/terms/package.json"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { log } from "../log/log"

export interface Config {
    desktop?: {
        "terms-agreed"?: {
            at?: string
            version?: string
        }
        dns?: DNSOption
    }
}

export class ConfigStore {
    @observable
    config: Config = {}

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
    }

    @action
    fetchConfig = async (): Promise<void> => {
        const config = await tequilapi.config()
        runInAction(() => {
            this.config = config.data
            log.info("Using config:", JSON.stringify(this.config))
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
}
