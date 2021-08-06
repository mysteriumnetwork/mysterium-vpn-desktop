/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface AppLocation {
    path: string
    title: string
}

export const locations = {
    onboarding: {
        path: "/onboarding",
        title: "Onboarding",
    },
    onboardingWelcome: {
        path: "/onboarding/welcome",
        title: "Onboarding / Welcome",
    },
    onboardingIntro: {
        path: "/onboarding/intro",
        title: "Onboarding / Intro",
    },
    onboardingIntro1: {
        path: "/onboarding/intro/1",
        title: "Onboarding / Intro / 1",
    },
    onboardingIntro2: {
        path: "/onboarding/intro/2",
        title: "Onboarding / Intro / 2",
    },
    onboardingIntro3: {
        path: "/onboarding/intro/3",
        title: "Onboarding / Intro / 3",
    },
    onboardingIntro4: {
        path: "/onboarding/intro/4",
        title: "Onboarding / Intro / 4",
    },
    onboardingIdentitySetup: {
        path: "/onboarding/identity/setup",
        title: "Onboarding / Identity / Create",
    },
    onboardingIdentityBackup: {
        path: "/onboarding/identity/backup",
        title: "Onboarding / Identity / Backup",
    },
    onboardingTopupPrompt: {
        path: "/onboarding/topup-prompt",
        title: "Onboarding / Topup",
    },
    onboardingWalletTopup: {
        path: "/onboarding/wallet/topup",
        title: "Onboarding / Wallet Topup",
    },
    onboardingComplete: {
        path: "/onboarding/complete",
        title: "Onboarding / Complete",
    },
    terms: {
        path: "/terms",
        title: "Terms",
    },
    identity: {
        path: "/identity",
        title: "Identity",
    },
    loading: {
        path: "/loading",
        title: "Loading",
    },
    wallet: {
        path: "/wallet",
        title: "Wallet",
    },
    walletIdentity: {
        path: "/wallet/identity",
        title: "Wallet/Identity",
    },
    walletTopup: {
        path: "/wallet/topup",
        title: "Wallet/Topup",
    },
    walletTopupSelectAmount: {
        path: "/wallet/topup/select-amount",
        title: "Wallet / Topup / Select Amount",
    },
    walletTopupSelectCurrency: {
        path: "/wallet/topup/select-currency",
        title: "Wallet / Topup / Select Currency",
    },
    walletTopupWaitingForPayment: {
        path: "/wallet/topup/waiting-for-payment",
        title: "Wallet / Topup / Waiting For Payment",
    },
    walletTopupSuccess: {
        path: "/wallet/topup/success",
        title: "Wallet / Topup / Success",
    },
    walletTopupFailed: {
        path: "/wallet/topup/failed",
        title: "Wallet / Topup / Failed",
    },
    consumer: {
        path: "/consumer",
        title: "Consumer",
    },
    proposals: {
        path: "/consumer/proposals",
        title: "Proposals",
    },
    connection: {
        path: "/consumer/connection",
        title: "Connection",
    },
    referrals: {
        path: "/referrals",
        title: "Refer a friend",
    },
    help: {
        title: "Help",
        path: "/help",
    },
    helpBugReport: {
        path: "/help/bug-report",
        title: "Bug report",
    },
    helpTermsAndConditions: {
        path: "/help/terms-and-conditions",
        title: "Terms & Conditions",
    },
    settings: {
        path: "/settings",
        title: "Settings",
    },
    settingsFilters: {
        path: "/settings/filters",
        title: "Settings/Filters",
    },
    settingsConnection: {
        path: "/settings/connection",
        title: "Settings/Connection",
    },
    settingsMysteriumId: {
        path: "/settings/mysterium-id",
        title: "Settings/Account",
    },
}

export const topupSteps = {
    selectAmount: "select-amount",
    selectCurrency: "select-currency",
    waitingForPayment: "waiting-for-payment",
    success: "success",
    failed: "failed",
}

export const locationByPath = (path: string): AppLocation | undefined =>
    Object.values(locations).find((loc) => loc.path == path)
