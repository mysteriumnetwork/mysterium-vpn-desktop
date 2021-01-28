/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action, observable } from "mobx"
import * as _ from "lodash"

import { RootStore } from "../store"
import { log } from "../log/log"
import { parseError } from "../errors/parse"
import { tequilapi } from "../tequilapi"

export class ReferralStore {
    @observable
    token?: string

    @observable
    message?: string

    @observable
    loading = false

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        log.debug("reserved")
    }

    @action
    async generateToken(): Promise<void> {
        const id = this.root.identity.identity?.id
        if (!id) {
            return
        }
        return _.throttle(async () => {
            this.setIsLoading(true)
            try {
                const tokenResponse = await tequilapi.getReferralToken(id)
                this.setToken(tokenResponse.token)
            } catch (err) {
                this.setMessage(parseError(err))
                log.error("Referral token generation failed", err)
            } finally {
                this.setIsLoading(false)
            }
        }, 60_000)()
    }

    @action
    setToken(token: string): void {
        this.token = token
        this.message = undefined
    }

    @action
    setMessage(message?: string): void {
        this.token = undefined
        this.message = message
    }

    @action
    setIsLoading(b: boolean): void {
        this.loading = b
    }
}
