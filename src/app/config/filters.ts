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

import { ProposalFilters } from "./store"

export class Filters {
    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            config: computed,
            country: computed,
            presetID: computed,
            setPartial: action,
            initialized: computed,
            defaults: computed,
            reset: action,
        })
        this.root = root
    }

    setupReactions(): void {
        reaction(() => this.root.config.config, this.onConfigChanged)
    }

    onConfigChanged = (): void => {
        const initialized = this.config.quality != null
        if (!initialized) {
            log.info("Config loaded. Filter configuration does not exist, initializing to defaults.")
            this.reset()
        }
    }

    get config(): ProposalFilters {
        return this.root.config.config.desktop?.filters || {}
    }

    setPartial = (filters: ProposalFilters): Promise<void> => {
        return this.root.config.updateDesktopConfigPartial({ filters })
    }

    get country(): string | undefined {
        return this.config.other?.country ?? undefined
    }

    get presetID(): number | undefined | null {
        return this.config.preset?.id
    }

    get initialized(): boolean {
        return this.config.quality?.level != null
    }

    get defaults(): ProposalFilters {
        return {
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
