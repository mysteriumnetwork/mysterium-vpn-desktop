/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, runInAction, when } from "mobx"
import tequilapi, { Currency, HttpTequilapiClient, TransactorFeesResponse } from "mysterium-vpn-js"

import { RootStore } from "../store"
import { analytics } from "../analytics/analytics-ui"
import { Category, WalletAction } from "../analytics/analytics"
import { DaemonStatusType } from "../daemon/store"

import { Money } from "./exchange"
import { fmtMoney } from "./display"

export class PaymentStore {
    root: RootStore

    @observable
    fees?: TransactorFeesResponse
    @observable
    mystToUsdRate?: Money
    @observable
    registrationTopupAmount?: number

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        when(
            () => this.root.daemon.status == DaemonStatusType.Up,
            async () => {
                await this.fetchMystToUsdRate()
            },
        )
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

    @action
    async fetchMystToUsdRate(): Promise<void> {
        const res = await (tequilapi as HttpTequilapiClient).http.get("/exchange/myst/dai")
        runInAction(() => {
            this.mystToUsdRate = res
        })
    }

    @computed
    get registrationFee(): number | undefined {
        if (!this.fees) {
            return undefined
        }
        return Number(fmtMoney({ amount: this.fees.registration, currency: Currency.MYSTTestToken }))
    }

    @computed
    get topupTotal(): number | undefined {
        const reg = this.registrationFee
        if (!reg) {
            return
        }
        return reg + (this.registrationTopupAmount ?? 0)
    }

    @action
    setRegistrationTopupAmount = (amount?: number): void => {
        this.registrationTopupAmount = amount
    }
}
