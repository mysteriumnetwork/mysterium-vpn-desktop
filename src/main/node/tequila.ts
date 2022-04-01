/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { TequilapiClient, TequilapiClientFactory } from "mysterium-vpn-js"
import _ from "lodash"
import { ipcMain } from "electron"

import { log } from "../../shared/log/log"
import { MainIpcListenChannels } from "../../shared/ipc"

export class Tequila {
    tequilapi: TequilapiClient

    constructor() {
        const TEQUILAPI_PORT = 44050
        this.tequilapi = new TequilapiClientFactory(`http://127.0.0.1:${TEQUILAPI_PORT}`, 8_000).build()
    }

    registerIPC() {
        ipcMain.on(MainIpcListenChannels.SaveUserConfig, (evt, cfg) => {
            this.persistConfigDebounced(cfg)
        })
    }

    persistConfigDebounced = _.debounce((cfg) => {
        log.info("Persisting user configuration:", JSON.stringify(cfg))
        this.tequilapi
            .updateUserConfig({ data: cfg })
            .then(() => log.info("Save OK"))
            .catch((err) => log.error("Save failed", err))
    }, 2_000)
}

export const tequila = new Tequila()
