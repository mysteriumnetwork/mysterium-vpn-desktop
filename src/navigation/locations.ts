/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface AppLocation {
    path: string
    title?: string
}

export const locations: { [key: string]: AppLocation } = {
    welcome: {
        path: "/welcome",
    },
    terms: {
        path: "/terms",
    },
    activate: {
        path: "/activate",
    },
    activateTopup: {
        path: "/activate-topup",
    },
    identity: {
        path: "/identity",
    },
    loading: {
        path: "/loading",
    },
    wallet: {
        path: "/wallet",
        title: "Wallet",
    },
    consumer: {
        path: "/consumer",
    },
    proposals: {
        path: "/consumer/proposals",
    },
    connection: {
        path: "/consumer/connection",
    },
    referrals: {
        path: "/referrals",
        title: "Refer a friend",
    },
    reportIssue: {
        path: "/report-issue",
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
    // modal child window
    topup: {
        path: "/topup",
    },
}

export const titleForPath = (path: string): string | undefined =>
    Object.values(locations).find((loc) => loc.path == path)?.title
