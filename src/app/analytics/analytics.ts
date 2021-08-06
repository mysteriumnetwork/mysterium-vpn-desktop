/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import MatomoTracker from "@datapunt/matomo-tracker-js"
import { TrackEventParams } from "@datapunt/matomo-tracker-js/lib/types"
import { TrackPageViewParams } from "@datapunt/matomo-tracker-js/es/types"
import { ipcRenderer } from "electron"

import * as packageJson from "../../../package.json"
import { isDevelopment } from "../../utils/env"
import { MainIpcListenChannels, WebIpcListenChannels } from "../../shared/ipc"
import { AppStateAction, Category, UserAction } from "../../shared/analytics/actions"

const appVersion = packageJson.version

let tracker: MatomoTracker
ipcRenderer.invoke(MainIpcListenChannels.GetMachineId).then((machineId) => {
    tracker = new MatomoTracker({
        siteId: 1,
        userId: machineId,
        urlBase: packageJson.analyticsUrl,
        disabled: isDevelopment(),
        linkTracking: false,
    })
})

export const initialize = (): void => {
    ipcRenderer.on(
        WebIpcListenChannels.AnalyticsAppStateEvent,
        (evt, action: AppStateAction, name?: string, value?: number) => {
            appStateEvent(action, name, value)
        },
    )
    ipcRenderer.on(
        WebIpcListenChannels.AnalyticsUserEvent,
        (evt, action: UserAction, name?: string, value?: number) => {
            userEvent(action, name, value)
        },
    )
}

// Record a page view
export const pageview = (params: TrackPageViewParams): void => {
    tracker?.trackPageView({
        ...params,
        customDimensions: [{ id: 1, value: appVersion }],
    })
}

const event = (params: TrackEventParams): void => {
    tracker?.trackEvent({
        ...params,
        customDimensions: [{ id: 1, value: appVersion }],
    })
}

// Record an application state event
export const appStateEvent = (action: AppStateAction, name?: string, value?: number): void => {
    event({
        category: Category.AppState,
        action,
        name,
        value,
    })
}

// Record a user interaction event
export const userEvent = (action: UserAction, name?: string, value?: number): void => {
    event({
        category: Category.UserAction,
        action,
        name,
        value,
    })
}
