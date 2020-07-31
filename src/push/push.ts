/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Pushy from "pushy-electron"
import { Notification, shell } from "electron"

import * as packageJson from "../../package.json"
import { log } from "../log/log"

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
}

const listener = (data: PushPayload) => {
    log.info("Push notification received: ", JSON.stringify(data))
    const notification = new Notification({
        title: data.title ?? packageJson.productName,
        body: data.message ?? "",
    })
    notification.on("click", () => {
        if (data.url != null) {
            shell.openExternal(data.url)
        }
    })
    notification.show()
}
