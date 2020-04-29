/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/ban-ts-ignore */
import ua from "universal-analytics"
import { App, BrowserWindow, screen } from "electron"

import * as packageJson from "../../package.json"

import { Action, AppAction, Category } from "./data"
import { getScreenResolution, machineId } from "./resolvers"

const ga = ua("UA-89155936-2", {
    cid: machineId(),
    strictCidFormat: false,
})
ga.set("ds", "app")
ga.debug(true)

export const setUserId = (userId: string): void => {
    ga.set("uid", userId)
}

export const event = (category: Category, action: Action, label?: string, value?: number): void => {
    ga.event(category, action, label ?? "", value ?? 0).send()
}

export const pageview = (path: string): void => {
    ga.pageview(path).send()
}

const setupParameters = (): void => {
    ga.set("an", packageJson.productName)
    ga.set("aid", "network.mysterium.desktop")
    ga.set("av", packageJson.version)
}

export const setupAnalyticsForApp = (app: App): void => {
    app.on("will-quit", () => {
        event(Category.App, AppAction.Quit)
    })
}

export const setupAnalyticsForWindow = (window: BrowserWindow): void => {
    ga.set("sr", getScreenResolution(window))
    ga.set("ua", window.webContents.userAgent)
    window.on("minimize", () => {
        event(Category.App, AppAction.MinimizeWindow)
    })
    window.on("moved", () => {
        ga.set("sr", getScreenResolution(window))
    })
    window.on("close", () => {
        event(Category.App, AppAction.CloseWindow)
    })
    window.on("restore", () => {
        event(Category.App, AppAction.RestoreWindow)
    })
    screen.removeAllListeners()
    screen.on("display-metrics-changed", () => {
        ga.set("sr", getScreenResolution(window))
    })
}

export const setupAnalyticsGlobals = (): void => {
    setupParameters()

    // @ts-ignore
    global.analyticsSetUserId = setUserId
    // @ts-ignore
    global.analyticsEvent = event
    // @ts-ignore
    global.analyticsPageview = pageview
}
