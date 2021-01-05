/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, observable, runInAction, when } from "mobx"
import tequilapi, {
    Currency,
    Fees,
    HttpTequilapiClient,
    PaymentOrderOptionsResponse,
    PaymentOrderResponse,
} from "mysterium-vpn-js"
import retry from "async-retry"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { log } from "../log/log"

import { Money } from "./exchange"
import { fmtMoney } from "./display"
import { isLightningAvailable } from "./currency"

export enum OrderStatus {
    PENDING,
    SUCCESS,
    FAILED,
}

export class PaymentStore {
    root: RootStore

    @observable
    fees?: Fees
    @observable
    mystToUsdRate?: Money
    @observable
    registrationTopupAmount?: number
    @observable
    topupAmount?: number
    @observable
    currencies: string[] = []
    @observable
    orderOptions?: PaymentOrderOptionsResponse
    @observable
    paymentCurrency?: string
    @observable
    lightningNetwork = false
    @observable
    order?: PaymentOrderResponse

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        when(
            () => this.root.daemon.status == DaemonStatusType.Up,
            () => {
                this.fetchMystToUsdRate()
                this.fetchCurrencies()
                this.fetchPaymentOptions()
            },
        )
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
        const res = await (tequilapi as HttpTequilapiClient).http.get("/exchange/myst/usd")
        runInAction(() => {
            this.mystToUsdRate = res
        })
    }

    @action
    async fetchCurrencies(): Promise<void> {
        const currencies = await tequilapi.getPaymentOrderCurrencies()
        runInAction(() => {
            this.currencies = currencies
            if (!this.paymentCurrency) {
                this.paymentCurrency = currencies[0]
                this.lightningNetwork = isLightningAvailable(currencies[0])
            }
        })
    }

    @computed
    get registrationFee(): number | undefined {
        if (!this.fees) {
            return undefined
        }
        return Number(fmtMoney({ amount: this.fees.registration, currency: Currency.MYSTTestToken }))
    }

    @action
    async fetchPaymentOptions(): Promise<void> {
        const options = await tequilapi.getPaymentOrderOptions()
        runInAction(() => {
            this.orderOptions = options
        })
    }
    @computed
    get orderOptionsValid(): boolean {
        let valid = !!this.root.identity.identity?.id && !!this.topupAmount && !!this.paymentCurrency
        if (this.orderOptions?.minimum && this.topupAmount) {
            valid &&= this.topupAmount >= this.orderMinimumAmount
        }
        return valid
    }
    @computed
    get orderMinimumAmount(): number {
        const min = this.orderOptions?.minimum
        if (!min) {
            return 0
        }
        return Math.round(min) + 1
    }

    @action
    async createOrder(): Promise<void> {
        const id = this.root.identity.identity?.id
        if (!id) {
            return
        }
        if (!this.topupAmount) {
            return
        }
        if (!this.paymentCurrency) {
            return
        }
        const order = await tequilapi.createPaymentOrder(id, {
            mystAmount: this.topupAmount,
            payCurrency: this.paymentCurrency,
            lightningNetwork: this.lightningNetwork,
        })
        log.info("Payment order created", order)
        runInAction(() => {
            this.order = order
        })

        retry(
            async () => {
                if (!this.order) {
                    return
                }
                const order = await tequilapi.getPaymentOrder(id, this.order.id)
                runInAction(() => {
                    this.order = order
                    log.info("Updated order", this.order)
                    if (this.orderStatus == OrderStatus.PENDING) {
                        throw Error("Order is in pending state")
                    }
                })
            },
            {
                retries: 60,
                factor: 1,
                minTimeout: 20_000,
                onRetry: (e, attempt) => log.warn(`Retrying payment order check (${attempt}): ${e.message}`),
            },
        )
    }

    @computed
    get orderStatus(): OrderStatus {
        if (!this.order) {
            return OrderStatus.PENDING
        }
        if (["confirming", "paid"].includes(this.order.status)) {
            return OrderStatus.SUCCESS
        } else if (["invalid", "expired", "canceled"].includes(this.order.status)) {
            return OrderStatus.FAILED
        } else {
            return OrderStatus.PENDING
        }
    }

    @action
    clearOrder(): void {
        this.order = undefined
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

    @action
    setPaymentCurrency = (currency?: string): void => {
        this.paymentCurrency = currency
        this.lightningNetwork = isLightningAvailable(currency)
    }

    @action
    setLightningNetwork = (use: boolean): void => {
        this.lightningNetwork = use
    }

    @action
    setTopupAmount = (amount?: number): void => {
        this.topupAmount = amount
    }
}
