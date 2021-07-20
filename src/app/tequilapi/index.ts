/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TequilapiClientFactory } from "mysterium-vpn-js"

export const TEQUILAPI_PORT = 44050
export const tequilapi = new TequilapiClientFactory(`http://127.0.0.1:${TEQUILAPI_PORT}`, 8_000).build()

export const sseUrl = `http://127.0.0.1:${TEQUILAPI_PORT}/events/state`
