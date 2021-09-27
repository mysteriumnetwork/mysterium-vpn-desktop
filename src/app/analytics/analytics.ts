/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { autorun } from "mobx"
import { ipcRenderer } from "electron"
import retry from "async-retry"

import * as packageJson from "../../../package.json"
import { rootStore } from "../store"
import { MainIpcListenChannels } from "../../shared/ipc"
import { log } from "../../shared/log/log"
import { isDevelopment } from "../../utils/env"

import { Client, Event } from "./event"

interface Request extends Event {
    client?: Client
}

export class Analytics {
    baseUrl: string
    disabled: boolean
    client: Client = {}

    constructor({ baseUrl, disabled }: { baseUrl: string; disabled: boolean }) {
        this.baseUrl = baseUrl
        this.disabled = disabled
    }

    initialize(): void {
        this.client.app_version = packageJson.version
        autorun(() => {
            this.client.os = rootStore.os
        })
        autorun(() => {
            this.client.country = rootStore.connection.originalLocation?.country
        })
        autorun(() => {
            this.client.consumer_id = rootStore.identity.identity?.id
        })
        ipcRenderer.invoke(MainIpcListenChannels.GetMachineId).then((machineId) => {
            this.client.machine_id = machineId
        })
        ipcRenderer.invoke(MainIpcListenChannels.GetOS).then((os) => {
            this.client.os = os
        })
        ipcRenderer.invoke(MainIpcListenChannels.GetOSVersion).then((os_version) => {
            this.client.os_version = os_version
        })
    }

    event = (name: Event["name"], fields?: Omit<Event, "name">): void => {
        log.debug("UserEvent:", name, fields, "Client:", this.client)
        if (this.disabled) {
            return
        }
        const MAX_RETRIES = 10
        const req: Request = {
            name,
            ...fields,
            client: this.client,
        }
        retry(
            async () => {
                return await fetch(`${this.baseUrl}/events`, {
                    mode: "no-cors",
                    method: "POST",
                    body: JSON.stringify(req),
                })
            },
            {
                onRetry: (e, attempt) => log.warn(`Failed to report event (${attempt}/${MAX_RETRIES}): ${e.message}`),
            },
        )
    }
}

export const analytics = new Analytics({
    baseUrl: "https://consumetrics.mysterium.network/api/v1",
    disabled: isDevelopment(),
})
