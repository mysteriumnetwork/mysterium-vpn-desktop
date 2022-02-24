/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const locations = {
    onboarding: "/onboarding",
    onboardingWelcome: "/onboarding/welcome",
    onboardingIntro: "/onboarding/intro",
    onboardingIntro1: "/onboarding/intro/1",
    onboardingIntro2: "/onboarding/intro/2",
    onboardingIntro3: "/onboarding/intro/3",
    onboardingIntro4: "/onboarding/intro/4",
    onboardingIdentitySetup: "/onboarding/identity/setup",
    onboardingIdentityBackup: "/onboarding/identity/backup",
    onboardingTopupPrompt: "/onboarding/topup-prompt",
    registering: "/registration",
    onboardingWalletTopup: "/onboarding/wallet/topup",
    onboardingComplete: "/onboarding/complete",
    terms: "/terms",
    identity: "/identity",
    loading: "/loading",
    wallet: "/wallet",
    walletIdentity: "/wallet/identity",
    walletTopup: "/wallet/topup",
    walletTopupSelectAmount: "/wallet/topup/select-amount",
    walletTopupSelectCurrency: "/wallet/topup/select-currency",
    walletTopupWaitingForPayment: "/wallet/topup/waiting-for-payment",
    walletTopupSuccess: "/wallet/topup/success",
    walletTopupFailed: "/wallet/topup/failed",
    consumer: "/consumer",
    proposals: "/consumer/proposals",
    proposalsManualConnect: "/consumer/proposals/manual-connect",
    proposalsQuickConnect: "/consumer/proposals/quick-connect",
    connection: "/consumer/connection",
    referrals: "/referrals",
    help: "/help",
    helpBugReport: "/help/bug-report",
    helpTermsAndConditions: "/help/terms-and-conditions",
    settings: "/settings",
    settingsFilters: "/settings/filters",
    settingsConnection: "/settings/connection",
    settingsMysteriumId: "/settings/mysterium-id",
}

export const topupSteps = {
    chooseMethod: "choose-method",
    coingate: "coingate", // entry point - redirects
    coingateSelectAmount: "coingate-select-amount",
    coingatePaymentOptions: "coingate-payment-options",
    coingateOrderSummary: "coingate-order-summary",
    coingateWaitingForPayment: "coingate-waiting-for-payment",
    cardinity: "cardinity", // entry point - redirects
    cardinitySelectAmount: "cardinity-select-amount",
    cardinityPaymentOptions: "cardinity-payment-options",
    cardinityOrderSummary: "cardinity-order-summary",
    cardinityWaitingForPayment: "cardinity-waiting-for-payment",
    paypal: "paypal", // entry point - redirects
    paypalSelectAmount: "paypal-select-amount",
    paypalPaymentOptions: "paypal-payment-options",
    paypalOrderSummary: "paypal-order-summary",
    paypalWaitingForPayment: "paypal-waiting-for-payment",
    myst: "myst", // entry point - redirects
    mystChooseChain: "myst-choose-chain",
    mystSelectAmount: "myst-select-amount",
    mystPolygonWaitingForPayment: "myst-polygon-waiting-for-payment",
    success: "success",
    failed: "failed",
}
