/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { action, makeObservable, observable } from "mobx"
import * as _ from "lodash"

import { RootStore } from "../store"
import { log, logErrorMessage } from "../../shared/log/log"
import { tequilapi } from "../tequilapi"
import { decimalPart } from "../payment/display"
import { parseError } from "../../shared/errors/parseError"

export class ReferralStore {
    token?: string
    rewardAmount?: number
    message?: string
    loading = false

    root: RootStore

    constructor(root: RootStore) {
        makeObservable(this, {
            token: observable,
            rewardAmount: observable,
            message: observable,
            loading: observable,
            validateToken: action,
            resetToken: action,
            generateToken: action,
            setToken: action,
            setMessage: action,
            setLoading: action,
        })
        this.root = root
    }

    async validateToken(code: string): Promise<boolean> {
        this.token = undefined
        this.rewardAmount = undefined
        try {
            const res = await tequilapi.referralTokenRewards(code)
            if (!res.amount) {
                return false
            }
            this.token = code
            this.rewardAmount = Number(Number(BigInt(res.amount) / BigInt(decimalPart())).toFixed(1))
            return true
        } catch (err) {
            log.error("Invalid referral token:", err)
            return false
        }
    }

    resetToken(): void {
        this.token = undefined
        this.rewardAmount = undefined
    }

    async generateToken(): Promise<void> {
        const id = this.root.identity.identity?.id
        if (!id) {
            return
        }
        return _.throttle(async () => {
            this.setLoading(true)
            try {
                const tokenResponse = await tequilapi.getReferralToken(id)
                this.setToken(tokenResponse.token)
            } catch (err) {
                const msg = parseError(err)
                logErrorMessage("Referral token generation failed", msg)
                this.setMessage(msg.humanReadable)
            } finally {
                this.setLoading(false)
            }
        }, 60_000)()
    }

    setToken(token: string): void {
        this.token = token
        this.message = undefined
    }

    setMessage(message?: string): void {
        this.token = undefined
        this.message = message
    }

    setLoading(b: boolean): void {
        this.loading = b
    }
}
