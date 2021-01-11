/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import tequilapi from "mysterium-vpn-js"
import { action, observable } from "mobx"

import { RootStore } from "../store"
import { log } from "../log/log"
import { parseError } from "../errors/parse"

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
    async generateToken(identity: string): Promise<void> {
        this.setIsLoading(true)
        try {
            const tokenResponse = await tequilapi.getReferralToken(identity)
            this.setToken(tokenResponse.token)
        } catch (err) {
            this.setMessage(parseError(err))
            log.error("Referral token generation failed", err)
        } finally {
            this.setIsLoading(false)
        }
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
