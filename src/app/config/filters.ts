/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, reaction } from "mobx"
import { QualityLevel } from "mysterium-vpn-js"

import { RootStore } from "../store"
import { log } from "../../shared/log/log"

import { PriceCeiling, ProposalFilters } from "./store"

export class Filters {
    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            priceCeiling: computed,
            config: computed,
            setPartial: action,
            initialized: computed,
            defaults: computed,
            reset: action,
        })
        this.root = root
    }

    setupReactions(): void {
        reaction(() => this.root.config.config, this.onConfigChanged)
        reaction(() => this.root.config.defaultConfig, this.onNodeDefaultConfigChanged)
    }

    onConfigChanged = (): void => {
        const initialized = this.config.price?.perhour != null
        if (!initialized) {
            log.info("Config loaded. Filter configuration does not exist, initializing to defaults.")
            this.reset()
        }
    }

    onNodeDefaultConfigChanged = (): void => {
        const initialized = this.config.price?.perhour != null
        if (!initialized) {
            log.info("Node defaults loaded. Filter configuration does not exist, initializing to defaults.")
            this.reset()
        }
    }

    get priceCeiling(): PriceCeiling | undefined {
        const consumerConfig = this.root.config.defaultConfig.payments?.consumer
        if (!consumerConfig || !consumerConfig["price-hour-max"] || !consumerConfig["price-gib-max"]) {
            return undefined
        }
        return {
            perHourMax: consumerConfig["price-hour-max"] * 60,
            perGibMax: consumerConfig["price-gib-max"],
        }
    }

    get config(): ProposalFilters {
        return this.root.config.config.desktop?.filters || {}
    }

    setPartial = (filters: ProposalFilters): Promise<void> => {
        return this.root.config.updateConfigPartial({ filters })
    }

    get initialized(): boolean {
        return this.config.price?.perhour != null
    }

    get defaults(): ProposalFilters {
        const ceil = this.priceCeiling
        return {
            price: {
                perhour: ceil ? ceil.perHourMax / 2 : undefined,
                pergib: ceil ? ceil.perGibMax / 2 : undefined,
            },
            quality: {
                level: QualityLevel.MEDIUM,
                "include-failed": false,
            },
        }
    }

    reset = (): Promise<void> => {
        return this.setPartial(this.defaults)
    }
}
