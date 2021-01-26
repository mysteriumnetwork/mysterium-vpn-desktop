/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TequilapiClientFactory, TIMEOUT_DEFAULT } from "mysterium-vpn-js"
import { TequilapiClient } from "mysterium-vpn-js/lib/tequilapi-client"
import { tequilapi as defaultTequilapiClient } from "mysterium-vpn-js/lib/tequilapi-client-factory"

export const DEFAULT_TEQUILAPI_PORT = 4050
const URL = `http://127.0.0.1`

class TequilapiClientProvider {
    __defaultClient: TequilapiClient
    __customClient?: TequilapiClient = undefined

    constructor() {
        this.__defaultClient = defaultTequilapiClient
        this.__customClient = undefined
    }

    rebuildClient(port: number): void {
        if (port === DEFAULT_TEQUILAPI_PORT) {
            return
        }
        this.__customClient = new TequilapiClientFactory(`${URL}:${port}`, TIMEOUT_DEFAULT).build()
    }

    client(): TequilapiClient {
        return this.__customClient ? this.__customClient : this.__defaultClient
    }
}

export const tequilapiProvider: TequilapiClientProvider = new TequilapiClientProvider()

export const defaultTequilapi = (): TequilapiClient => defaultTequilapiClient

export const tequilapi = (): TequilapiClient => tequilapiProvider.client()

export const rebuildTequilapiClient = (port: number): void => tequilapiProvider.rebuildClient(port)
