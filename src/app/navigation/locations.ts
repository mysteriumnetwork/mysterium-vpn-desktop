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
    onboarding1: {
        path: "/onboarding/1",
        title: "Onboarding / 1",
    },
    onboarding2: {
        path: "/onboarding/2",
        title: "Onboarding / 2",
    },
    onboarding3: {
        path: "/onboarding/3",
        title: "Onboarding / 3",
    },
    onboarding4: {
        path: "/onboarding/4",
        title: "Onboarding / 4",
    },
    onboardingComplete: {
        path: "/onboarding/complete",
        title: "Onboarding / Complete",
    },
    terms: {
        path: "/terms",
        title: "Terms",
    },
    activate: {
        path: "/activate",
        title: "Activate",
    },
    activateTopup: {
        path: "/activate-topup",
        title: "Activate / Topup",
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
    settingsAccount: {
        path: "/settings/account",
        title: "Settings/Account",
    },
}

export const locationByPath = (path: string): AppLocation | undefined =>
    Object.values(locations).find((loc) => loc.path == path)
