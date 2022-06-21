/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const locations = {
    loading: "/loading",
    onboarding: "/onboarding",
    onboardingWelcome: "/onboarding/welcome",
    onboardingIntroIndex: "/onboarding/intro",
    onboardingIntro2: "/onboarding/intro/2",
    onboardingIntro3: "/onboarding/intro/3",
    onboardingIntro4: "/onboarding/intro/4",
    onboardingIdentitySetup: "/onboarding/identity/setup",
    onboardingIdentityBackup: "/onboarding/identity/backup",
    onboardingTopupPrompt: "/onboarding/topup-prompt",
    onboardingWalletTopup: "/onboarding/wallet/topup",
    terms: "/terms",
    idRegistering: "/registration",
    idUpgrading: "/id-upgrade",
    wallet: "/wallet",
    walletTopup: "/wallet/topup",
    consumer: "/consumer",
    proposals: "/consumer/proposals",
    proposalsManualConnect: "/consumer/proposals/manual-connect",
    proposalsQuickConnect: "/consumer/proposals/quick-connect",
    connection: "/consumer/connection",
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
    coingate: "coingate", // entry point
    coingatePaymentOptions: "coingate-payment-options",
    coingateOrderSummary: "coingate-order-summary",
    coingateWaitingForPayment: "coingate-waiting-for-payment",
    stripe: "stripe", // entry point
    stripePaymentOptions: "stripe-payment-options",
    stripeOrderSummary: "stripe-order-summary",
    stripeWaitingForPayment: "stripe-waiting-for-payment",
    paypal: "paypal", // entry point
    paypalPaymentOptions: "paypal-payment-options",
    paypalOrderSummary: "paypal-order-summary",
    paypalWaitingForPayment: "paypal-waiting-for-payment",
    myst: "myst", // entry point
    mystSelectAmount: "myst-select-amount",
    mystPolygonWaitingForPayment: "myst-polygon-waiting-for-payment",
    success: "success",
    failed: "failed",
}
