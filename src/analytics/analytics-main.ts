/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ua from "universal-analytics"
import { App, BrowserWindow, screen } from "electron"
import { machineIdSync } from "node-machine-id"

import * as packageJson from "../../package.json"

import { Analytics, Action, AppAction, Category } from "./analytics"

export const getScreenResolution = (window: BrowserWindow): string => {
    const display = screen.getDisplayMatching(window.getBounds())
    return `${display.size.width}x${display.size.height}`
}

export const machineId = (): string => machineIdSync()

const ga = ua(packageJson.analyticsAccountId, {
    cid: machineId(),
    strictCidFormat: false,
})
// ga.debug(true)

export const analytics: Analytics = {
    setUserId(userId: string) {
        ga.set("uid", userId)
    },
    event(category: Category, action: Action, label?: string, value?: number) {
        ga.event(category, action, label ?? "", value ?? 0).send()
    },
    pageview(path: string) {
        ga.pageview(path).send()
    },
}

export const initialize = (): void => {
    ga.set("an", packageJson.productName)
    ga.set("aid", "network.mysterium.desktop")
    ga.set("av", packageJson.version)
}

export const setupGlobals = (): void => {
    global.analyticsSetUserId = analytics.setUserId
    global.analyticsEvent = analytics.event
    global.analyticsPageview = analytics.pageview
}

export const setupApp = (app: App): void => {
    app.on("will-quit", () => {
        analytics.event(Category.App, AppAction.Quit)
    })
}

export const setupWindow = (window: BrowserWindow): void => {
    ga.set("sr", getScreenResolution(window))
    ga.set("ua", window.webContents.userAgent)
    window.on("minimize", () => {
        analytics.event(Category.App, AppAction.MinimizeWindow)
    })
    window.on("moved", () => {
        ga.set("sr", getScreenResolution(window))
    })
    window.on("close", () => {
        analytics.event(Category.App, AppAction.CloseWindow)
    })
    window.on("restore", () => {
        analytics.event(Category.App, AppAction.RestoreWindow)
    })
    screen.removeAllListeners()
    screen.on("display-metrics-changed", () => {
        ga.set("sr", getScreenResolution(window))
    })
}
