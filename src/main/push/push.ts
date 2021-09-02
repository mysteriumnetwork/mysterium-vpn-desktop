/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Pushy from "pushy-electron"
import { Notification, shell } from "electron"
import { ipcMain } from "electron"

import * as packageJson from "../../../package.json"
import { log } from "../../shared/log/log"
import { webAnalyticsAppStateEvent, webAnalyticsUserEvent } from "../analytics"
import { AppStateAction, OtherAction } from "../../shared/analytics/actions"
import { MainIpcListenChannels } from "../../shared/ipc"

interface PushPayload {
    title?: string
    message?: string
    url?: string
}

export const initialize = (): void => {
    Pushy.listen()
    Pushy.register({ appId: packageJson.pushyAppId })
        .then((deviceToken: string) => {
            // Display an alert with device token
            log.info("Pushy device token:", deviceToken)
        })
        .catch((err: Error) => {
            // Display error dialog
            log.error("Pushy registration error", err.message)
        })
    Pushy.setNotificationListener(listener)
    ipcMain.on(MainIpcListenChannels.PushSubscribe, (evt, pushTopic) => {
        if (Pushy.isRegistered()) {
            const qualifiedTopic = "desktop." + pushTopic
            log.info("Subscribing to:", qualifiedTopic)
            Pushy.subscribe(qualifiedTopic)
        }
    })
    ipcMain.on(MainIpcListenChannels.PushUnsubscribe, (evt, pushTopic) => {
        if (Pushy.isRegistered()) {
            const qualifiedTopic = "desktop." + pushTopic
            log.info("Unsubscribing from:", qualifiedTopic)
            Pushy.unsubscribe(qualifiedTopic)
        }
    })
}

const listener = (data: PushPayload) => {
    log.info("Push notification received: ", JSON.stringify(data))
    const notification = new Notification({
        title: data.title ?? packageJson.productName,
        body: data.message ?? "",
    })
    webAnalyticsAppStateEvent(AppStateAction.PushNotificationShown, data.url)
    notification.on("click", () => {
        webAnalyticsUserEvent(OtherAction.PushNotificationClick, data.url)
        if (data.url != null) {
            shell.openExternal(data.url)
        }
    })
    notification.show()
}
