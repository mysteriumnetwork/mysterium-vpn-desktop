/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, computed, makeObservable, observable, runInAction, toJS, when } from "mobx"
import {
    CreatePaymentOrderRequest,
    Currency,
    EntertainmentEstimateResponse,
    FeesV2,
    Money,
    PaymentGateway,
    PaymentOrder,
} from "mysterium-vpn-js"
import retry from "async-retry"
import { ipcRenderer } from "electron"
import BigNumber from "bignumber.js"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { log, logErrorMessage } from "../../shared/log/log"
import { tequilapi } from "../tequilapi"
import { parseError } from "../../shared/errors/parseError"
import { MainIpcListenChannels } from "../../shared/ipc"

import { AmountMultiCurrency, isLightningAvailable } from "./currency"
import { Gateway, PaymentMethod, SUPPORTED_METHODS } from "./methods"

export enum OrderStatus {
    PENDING,
    SUCCESS,
    FAILED,
}

export enum MystChain {
    POLYGON = "polygon",
    ETHEREUM = "ethereum",
}

export class PaymentStore {
    root: RootStore

    appCurrency: Currency = Currency.MYST
    appFiatCurrency = "USD"

    fees?: FeesV2
    mystToUsdRate?: Money
    topUpAmountUSD?: number
    paymentMethod?: PaymentMethod
    paymentGateways?: PaymentGateway[]
    paymentMethods: PaymentMethod[] = []
    paymentCurrency?: string
    chain?: MystChain
    taxCountry?: string
    taxState?: string
    lightningNetwork = false
    order?: PaymentOrder
    orderExpiresAt?: Date

    constructor(root: RootStore) {
        makeObservable(this, {
            appCurrency: observable,
            fees: observable,
            mystToUsdRate: observable,
            topUpAmountUSD: observable,
            paymentMethod: observable,

            paymentGateways: observable,
            paymentMethods: observable,
            currencies: computed,
            orderOptions: computed,

            paymentCurrency: observable,
            chain: observable,
            taxCountry: observable,
            taxState: observable,
            lightningNetwork: observable,
            order: observable,
            fetchTransactorFees: action,
            fetchMystToUsdRate: action,
            createOrder: action,
            openOrderSecureForm: action,
            orderStatus: computed,
            downloadInvoice: action,
            clearOrder: action,
            clearPaymentOptions: action,
            setPaymentMethod: action,
            setPaymentCurrency: action,
            setLightningNetwork: action,
            setTaxCountry: action,
            setTaxState: action,
            setChain: action,
            setTopupAmountUSD: action,
            refreshBalance: action,
        })
        this.root = root
    }

    setupReactions(): void {
        when(
            () => this.root.daemon.status == DaemonStatusType.Up,
            () => {
                this.fetchMystToUsdRate()
            },
        )
    }

    async fetchTransactorFees(): Promise<void> {
        const fees = await tequilapi.transactorFeesV2()
        runInAction(() => {
            this.fees = fees?.current
        })
    }

    async fetchMystToUsdRate(): Promise<void> {
        const res = await tequilapi.exchangeRate("usd")
        runInAction(() => {
            this.mystToUsdRate = res
        })
    }

    fiatEquivalent(amount: number): number {
        const rate = this.mystToUsdRate?.amount ?? 0
        return new BigNumber(amount).times(rate).toNumber()
    }

    async fetchPaymentGateways(): Promise<void> {
        const gateways = await tequilapi.payment.gateways("USD")
        runInAction(() => {
            this.paymentGateways = gateways
        })
        runInAction(() => {
            this.paymentMethods = Object.keys(SUPPORTED_METHODS)
                .map((name) => {
                    const meta = SUPPORTED_METHODS[name]
                    const gatewayData = this.paymentGateways?.find((gw) => gw.name === meta.gateway)
                    return { name, ...meta, gatewayData } as PaymentMethod
                })
                .filter((m) => m.gatewayData != null)
                .sort((a, b) => (a < b ? -1 : 1))
        })
    }

    get orderOptions(): number[] {
        return this.paymentMethod?.gatewayData.orderOptions.suggested ?? []
    }

    get currencies(): string[] {
        return this.paymentMethod?.gatewayData.currencies ?? []
    }

    buildCallerData(): CreatePaymentOrderRequest["gatewayCallerData"] {
        const gateway = this.paymentMethod?.gateway
        switch (gateway) {
            case Gateway.COINGATE:
                return {
                    lightningNetwork: this.lightningNetwork,
                }
            case Gateway.PAYPAL:
            case Gateway.STRIPE:
                return {}
        }
        throw new Error("Unsupported payment gateway: " + gateway)
    }

    validateOrderResponse(order: PaymentOrder): void {
        switch (this.paymentMethod?.gateway) {
            case Gateway.COINGATE:
                if (!order.publicGatewayData?.paymentUrl) {
                    throw new Error("Could not retrieve payment URL")
                }
                return
            case Gateway.STRIPE:
                if (!order.publicGatewayData?.secureForm) {
                    throw new Error("Could not retrieve secure form for payment")
                }
                return
        }
    }

    async createOrder(): Promise<void> {
        const id = this.root.identity.identity?.id
        if (!id || !this.topUpAmountUSD || !this.paymentCurrency || !this.paymentMethod) {
            return
        }

        const order = await tequilapi.payment.createOrder(id, this.paymentMethod.gateway, {
            country: this.taxCountry || "",
            state: this.taxState || "",
            amountUsd: new BigNumber(this.topUpAmountUSD).toFixed(2),
            payCurrency: this.paymentCurrency,
            gatewayCallerData: this.buildCallerData(),
        })
        log.info("Payment order created", order)
        this.validateOrderResponse(order)
        log.info("Payment order validated")

        runInAction(() => {
            this.order = order
            if (order.publicGatewayData?.expireAt) {
                this.orderExpiresAt = new Date(order.publicGatewayData.expireAt)
            }
        })

        retry(
            async () => {
                if (!this.order) {
                    return
                }
                const order = await tequilapi.payment.order(id, this.order.id)
                runInAction(() => {
                    this.order = order
                    log.info("Updated order", toJS(this.order))
                    if (this.orderStatus == OrderStatus.PENDING) {
                        throw Error("Order is in pending state")
                    }
                })
            },
            {
                retries: 60,
                factor: 1,
                minTimeout: 10_000,
                onRetry: (e, attempt) => log.warn(`Retrying payment order check (${attempt}): ${e.message}`),
            },
        )
    }

    async openOrderSecureForm(): Promise<void> {
        if (this.order?.publicGatewayData?.secureForm) {
            ipcRenderer.send(
                MainIpcListenChannels.OpenSecureFormPaymentWindow,
                this.order.publicGatewayData?.secureForm,
            )
        }
    }

    get orderStatus(): OrderStatus {
        if (!this.order) {
            return OrderStatus.PENDING
        }
        if (["confirming", "paid"].includes(this.order.status)) {
            return OrderStatus.SUCCESS
        } else if (["invalid", "expired", "canceled", "failed"].includes(this.order.status)) {
            return OrderStatus.FAILED
        } else {
            return OrderStatus.PENDING
        }
    }

    async downloadInvoice(): Promise<void> {
        const id = this.root.identity.identity?.id
        const orderId = this.order?.id
        if (!id || !orderId) {
            return
        }

        const data = await tequilapi.payment.invoice(id, orderId)
        // create a download anchor tag
        const downloadLink = document.createElement("a")
        downloadLink.target = "_blank"
        downloadLink.download = `MysteriumVPN-order-${orderId}.pdf`

        // convert downloaded data to a Blob
        const blob = new Blob([data], { type: "application/pdf" })

        // create an object URL from the Blob
        const URL = window.URL || window.webkitURL
        const downloadUrl = URL.createObjectURL(blob)

        // set object URL as the anchor's href
        downloadLink.href = downloadUrl

        // append the anchor to document body
        document.body.appendChild(downloadLink)

        // fire a click event on the anchor
        downloadLink.click()

        // cleanup: remove element and revoke object URL
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(downloadUrl)
    }

    async startTopupFlow(location: string): Promise<void> {
        await Promise.all([this.fetchPaymentGateways(), this.fetchMystToUsdRate()])
        this.setPaymentMethod(undefined)
        this.clearPaymentOptions()
        this.clearOrder()
        this.root.navigation.push(location)
    }

    async onPaymentMethodChosen(): Promise<void> {
        this.clearPaymentOptions()
        this.clearOrder()
    }

    clearOrder(): void {
        this.order = undefined
        this.orderExpiresAt = undefined
    }

    clearPaymentOptions(): void {
        this.setPaymentCurrency(undefined)
        this.setLightningNetwork(false)
        this.setChain(undefined)
        this.setTopupAmountUSD(undefined)
    }

    setPaymentMethod = (pm?: PaymentMethod): void => {
        this.paymentMethod = pm
    }

    setPaymentCurrency = (currency?: string): void => {
        this.paymentCurrency = currency
        this.lightningNetwork = isLightningAvailable(currency)
    }

    setChain = (chain?: MystChain): void => {
        this.chain = chain
    }

    setTaxCountry = (country?: string): void => {
        this.taxCountry = country
    }

    setTaxState = (state?: string): void => {
        this.taxState = state
    }

    setLightningNetwork = (use: boolean): void => {
        this.lightningNetwork = use
    }

    setTopupAmountUSD = (amountUSD?: number): void => {
        this.topUpAmountUSD = amountUSD
    }

    estimateEntertainment = async (amount: AmountMultiCurrency): Promise<EntertainmentEstimateResponse | undefined> => {
        let amt
        if (amount.USD != null && this.mystToUsdRate?.amount) {
            amt = amount.USD / this.mystToUsdRate.amount
        } else if (amount.MYST != null) {
            amt = amount.MYST
        } else {
            return undefined
        }
        try {
            return await tequilapi
                .estimateEntertainment({ amount: amt })
                .then((res: EntertainmentEstimateResponse) => ({
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

    refreshBalance = async (): Promise<void> => {
        const id = this.root.identity.identity?.id
        if (!id) {
            return
        }
        await tequilapi.identityBalanceRefresh(id)
    }
}
