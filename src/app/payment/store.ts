/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable, runInAction, when } from "mobx"
import { Currency, EntertainmentEstimateResponse, Fees, Money, PaymentOrderResponse } from "mysterium-vpn-js"
import retry from "async-retry"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { log, logErrorMessage } from "../../shared/log/log"
import { tequilapi } from "../tequilapi"
import { parseError } from "../../shared/errors/parseError"

import { fmtMoney } from "./display"
import { isLightningAvailable } from "./currency"
import { mystToUSD } from "./rate"

const _20minutes = 20 * 60 * 1000
const orderExpirationPeriod = _20minutes

export enum OrderStatus {
    PENDING,
    SUCCESS,
    FAILED,
}

export class PaymentStore {
    root: RootStore

    appCurrency: Currency = Currency.MYSTTestToken
    appFiatCurrency = "USD"

    fees?: Fees
    mystToUsdRate?: Money
    registrationTopupAmount?: number
    topupAmount?: number
    currencies: string[] = []
    orderOptions: number[] = []
    paymentCurrency?: string
    lightningNetwork = false
    order?: PaymentOrderResponse
    orderExpiresAt?: Date

    constructor(root: RootStore) {
        makeObservable(this, {
            appCurrency: observable,
            fees: observable,
            mystToUsdRate: observable,
            registrationTopupAmount: observable,
            topupAmount: observable,
            currencies: observable,
            orderOptions: observable,
            paymentCurrency: observable,
            lightningNetwork: observable,
            order: observable,
            fetchTransactorFees: action,
            fetchMystToUsdRate: action,
            fetchCurrencies: action,
            registrationFee: computed,
            fetchPaymentOptions: action,
            createOrder: action,
            orderStatus: computed,
            clearOrder: action,
            topupTotal: computed,
            setRegistrationTopupAmount: action,
            setPaymentCurrency: action,
            setLightningNetwork: action,
            setTopupAmount: action,
        })
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

    async fetchTransactorFees(): Promise<void> {
        const fees = await tequilapi.transactorFees()
        runInAction(() => {
            this.fees = fees
        })
    }

    async fetchMystToUsdRate(): Promise<void> {
        const res = await tequilapi.exchangeRate("usd")
        runInAction(() => {
            this.mystToUsdRate = res
        })
    }

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

    get registrationFee(): number | undefined {
        if (!this.fees) {
            return undefined
        }
        return Number(fmtMoney({ amount: this.fees.registration, currency: Currency.MYSTTestToken }))
    }

    fiatEquivalent(amount: number): number {
        return mystToUSD(amount, this.mystToUsdRate?.amount ?? 0) ?? 0
    }

    async fetchPaymentOptions(): Promise<void> {
        const optionsResponse = await tequilapi.getPaymentOrderOptions()
        runInAction(() => {
            this.orderOptions = optionsResponse.suggested.slice(0, 6)
        })
    }

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
            this.orderExpiresAt = new Date(Date.now() + orderExpirationPeriod)
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

    clearOrder(): void {
        this.order = undefined
        this.orderExpiresAt = undefined
        this.setPaymentCurrency(this.currencies[0])
        this.setLightningNetwork(isLightningAvailable(this.currencies[0]))
        this.setTopupAmount(undefined)
    }

    get topupTotal(): number | undefined {
        const reg = this.registrationFee
        if (!reg) {
            return
        }
        return reg + (this.registrationTopupAmount ?? 0)
    }

    setRegistrationTopupAmount = (amount?: number): void => {
        this.registrationTopupAmount = amount
    }

    setPaymentCurrency = (currency?: string): void => {
        this.paymentCurrency = currency
        this.lightningNetwork = isLightningAvailable(currency)
    }

    setLightningNetwork = (use: boolean): void => {
        this.lightningNetwork = use
    }

    setTopupAmount = (amount?: number): void => {
        this.topupAmount = amount
    }

    estimateEntertainment = async (amount: number, big = false): Promise<EntertainmentEstimateResponse | undefined> => {
        try {
            let amt = amount
            if (big) {
                amt = Number(fmtMoney({ amount, currency: this.appCurrency }))
            }
            return await tequilapi.estimateEntertainment({ amount: amt }).then((res) => ({
                videoMinutes: Number((res.videoMinutes / 60).toFixed(0)),
                musicMinutes: Number((res.musicMinutes / 60).toFixed(0)),
                browsingMinutes: Number((res.browsingMinutes / 60).toFixed(0)),
                trafficMb: Number((res.trafficMb / 1024).toFixed()),
            }))
        } catch (err) {
            const msg = parseError(err)
            logErrorMessage("Failed to estimate entertainment for amount: " + amount, msg)
            return undefined
        }
    }
}
