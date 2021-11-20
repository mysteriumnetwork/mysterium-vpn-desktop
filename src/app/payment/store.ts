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
    Fees,
    Money,
    PaymentGateway,
    PaymentOrder,
} from "mysterium-vpn-js"
import retry from "async-retry"
import { Decimal } from "decimal.js-light"
import { ipcRenderer } from "electron"

import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"
import { log, logErrorMessage } from "../../shared/log/log"
import { tequilapi } from "../tequilapi"
import { parseError } from "../../shared/errors/parseError"
import { MainIpcListenChannels } from "../../shared/ipc"

import { fmtMoney } from "./display"
import { isLightningAvailable } from "./currency"
import { mystToUSD } from "./rate"

export enum OrderStatus {
    PENDING,
    SUCCESS,
    FAILED,
}

export enum PaymentType {
    FIAT = "fiat",
    CRYPTO = "crypto",
}

export const SUPPORTED_PAYMENT_METHODS: { [val: string]: PaymentMethod } = {
    COINGATE: {
        gateway: "coingate",
        type: PaymentType.CRYPTO,
        display: "Crypto",
        currencies: [], // returned from backend
    },
    CARDINITY: {
        gateway: "cardinity",
        type: PaymentType.FIAT,
        display: "Credit card",
        currencies: [],
    },
}

export interface PaymentMethod {
    gateway: string
    type: PaymentType
    display: string
    currencies: string[]
}

export class PaymentStore {
    root: RootStore

    appCurrency: Currency = Currency.MYST
    appFiatCurrency = "USD"

    fees?: Fees
    mystToUsdRate?: Money
    registrationTopupAmount?: number
    topupAmount?: number
    paymentMethod?: PaymentMethod
    paymentGateways?: PaymentGateway[]
    paymentCurrency?: string
    lightningNetwork = false
    order?: PaymentOrder
    orderExpiresAt?: Date

    constructor(root: RootStore) {
        makeObservable(this, {
            appCurrency: observable,
            fees: observable,
            mystToUsdRate: observable,
            registrationTopupAmount: observable,
            topupAmount: observable,
            paymentMethod: observable,

            paymentGateways: observable,
            orderOptions: computed,
            paymentMethods: computed,

            paymentCurrency: observable,
            lightningNetwork: observable,
            order: observable,
            fetchTransactorFees: action,
            fetchMystToUsdRate: action,
            registrationFee: computed,
            createOrder: action,
            orderStatus: computed,
            downloadInvoice: action,
            clearOrder: action,
            topupTotal: computed,
            setRegistrationTopupAmount: action,
            setPaymentMethod: action,
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

    get registrationFee(): number | undefined {
        if (!this.fees) {
            return undefined
        }
        return Number(fmtMoney({ amount: this.fees.registration, currency: Currency.MYST }))
    }

    fiatEquivalent(amount: number): number {
        return mystToUSD(amount, this.mystToUsdRate?.amount ?? 0) ?? 0
    }

    async fetchPaymentGateways(): Promise<void> {
        const gateways = await tequilapi.payment.gateways()
        runInAction(() => {
            this.paymentGateways = gateways
        })
    }

    get orderOptions(): number[] {
        if (!this.paymentGateways) {
            return []
        }
        const gw = this.paymentGateways
            .slice()
            .sort((a, b) => (a.orderOptions.suggested[0] < b.orderOptions.suggested[0] ? 1 : -1))[0]
        return gw.orderOptions.suggested.slice(0, 6)
    }

    get paymentMethods(): PaymentMethod[] {
        return (
            (this.paymentGateways || [])
                .map((gw) => {
                    const match = Object.values(SUPPORTED_PAYMENT_METHODS).find((m) => m.gateway === gw.name)
                    if (!match) {
                        return undefined
                    }
                    return {
                        gateway: gw.name,
                        currencies: gw.currencies,
                        type: match.type,
                        display: match.display,
                    }
                })
                .filter(Boolean) as PaymentMethod[]
        ).sort((a, b) => a.type.localeCompare(b.type))
    }

    buildCallerData(): CreatePaymentOrderRequest["gatewayCallerData"] {
        if (this.paymentMethod?.gateway === SUPPORTED_PAYMENT_METHODS.COINGATE.gateway) {
            return {
                lightningNetwork: this.lightningNetwork,
            }
        }
        if (this.paymentMethod?.gateway === SUPPORTED_PAYMENT_METHODS.CARDINITY.gateway) {
            return {
                country: this.root.connection.originalLocation?.country,
            }
        }
        throw new Error("Unsupported payment gateway")
    }
    validateOrderResponse(order: PaymentOrder): void {
        if (this.paymentMethod?.gateway === SUPPORTED_PAYMENT_METHODS.COINGATE.gateway) {
            if (!order.publicGatewayData?.paymentAddress) {
                throw new Error("Could not retrieve payment address")
            }
            if (!order.publicGatewayData?.paymentUrl) {
                throw new Error("Could not retrieve payment URL")
            }
            return
        }
        if (this.paymentMethod?.gateway === SUPPORTED_PAYMENT_METHODS.CARDINITY.gateway) {
            if (!order.publicGatewayData?.secureForm) {
                throw new Error("Could not retrieve secure form for payment")
            }
            return
        }
    }

    async createOrder(): Promise<void> {
        const id = this.root.identity.identity?.id
        if (!id || !this.topupAmount || !this.paymentCurrency || !this.paymentMethod) {
            return
        }

        const order = await tequilapi.payment.createOrder(id, this.paymentMethod.gateway, {
            country: this.root.connection.originalLocation?.country || "",
            mystAmount: new Decimal(this.topupAmount).toFixed(2),
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
            if (order.publicGatewayData?.secureForm) {
                ipcRenderer.send(MainIpcListenChannels.OpenCardinityPaymentWindow, order.publicGatewayData?.secureForm)
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
        this.clearOrder()
        this.root.router.push(location)
    }

    clearOrder(): void {
        this.order = undefined
        this.orderExpiresAt = undefined
        this.setPaymentMethod(undefined)
        this.setPaymentCurrency(undefined)
        this.setLightningNetwork(false)
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

    setPaymentMethod = (pm?: PaymentMethod): void => {
        this.paymentMethod = pm
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
}
