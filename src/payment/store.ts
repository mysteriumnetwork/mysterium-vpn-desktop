/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, runInAction } from "mobx"
import tequilapi, { TransactorFeesResponse } from "mysterium-vpn-js"

import { RootStore } from "../store"
import { analytics } from "../analytics/analytics-ui"
import { Category, WalletAction } from "../analytics/analytics"

export class PaymentStore {
    root: RootStore

    @observable
    fees?: TransactorFeesResponse

    constructor(root: RootStore) {
        this.root = root
    }

    @action
    async topUp(): Promise<void> {
        analytics.event(Category.Wallet, WalletAction.Topup)
        return await tequilapi.topUp({
            identity: this.root.identity.identity?.id ?? "",
        })
    }

    @action
    async fetchTransactorFees(): Promise<void> {
        const fees = await tequilapi.transactorFees()
        runInAction(() => {
            this.fees = fees
        })
    }

    @computed
    get registrationTopup(): number | undefined {
        if (!this.fees) {
            return undefined
        }
        return this.fees.registration + 900000000000000000
    }
}
