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

export const locations: { [key: string]: AppLocation } = {
    welcome: {
        path: "/welcome",
        title: "Welcome",
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
    preferences: {
        path: "/preferences",
        title: "Preferences",
    },
    preferencesFilters: {
        path: "/preferences/filters",
        title: "Filters",
    },
}

export const locationByPath = (path: string): AppLocation | undefined =>
    Object.values(locations).find((loc) => loc.path == path)
