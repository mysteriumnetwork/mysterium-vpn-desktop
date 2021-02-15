/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface AppLocation {
    path: string
    title: string
    breadcrumb: boolean
}

export const locations: { [key: string]: AppLocation } = {
    welcome: {
        path: "/welcome",
        title: "Welcome",
        breadcrumb: false,
    },
    terms: {
        path: "/terms",
        title: "Terms",
        breadcrumb: false,
    },
    activate: {
        path: "/activate",
        title: "Activate",
        breadcrumb: false,
    },
    activateTopup: {
        path: "/activate-topup",
        title: "Activate / Topup",
        breadcrumb: false,
    },
    identity: {
        path: "/identity",
        title: "Identity",
        breadcrumb: false,
    },
    loading: {
        path: "/loading",
        title: "Loading",
        breadcrumb: false,
    },
    wallet: {
        path: "/wallet",
        title: "Wallet",
        breadcrumb: true,
    },
    consumer: {
        path: "/consumer",
        title: "Consumer",
        breadcrumb: false,
    },
    proposals: {
        path: "/consumer/proposals",
        title: "Proposals",
        breadcrumb: false,
    },
    connection: {
        path: "/consumer/connection",
        title: "Connection",
        breadcrumb: false,
    },
    referrals: {
        path: "/referrals",
        title: "Refer a friend",
        breadcrumb: true,
    },
    reportIssue: {
        path: "/report-issue",
        title: "Bug report",
        breadcrumb: true,
    },
    preferences: {
        path: "/preferences",
        title: "Preferences",
        breadcrumb: true,
    },
    preferencesFilters: {
        path: "/preferences/filters",
        title: "Filters",
        breadcrumb: true,
    },
}

export const locationByPath = (path: string): AppLocation | undefined =>
    Object.values(locations).find((loc) => loc.path == path)
