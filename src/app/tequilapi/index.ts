/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { EventEmitter } from "events"

import { parseSSEResponse, TequilapiClientFactory } from "mysterium-vpn-js"

import { log } from "../../shared/log/log"

export const TEQUILAPI_PORT = 44050
export const tequilapi = new TequilapiClientFactory(`http://127.0.0.1:${TEQUILAPI_PORT}`, 8_000).build()

export const SSE_URL = `http://127.0.0.1:${TEQUILAPI_PORT}/events/state`
export const eventBus = new EventEmitter()
export const sseConnect = (): EventSource => {
    const es = new EventSource(SSE_URL)
    es.onerror = (evt): void => {
        log.error("[sse error]", evt)
    }
    es.onmessage = (evt): void => {
        const { type, payload } = parseSSEResponse(evt.data)
        log.debug("[sse message event]", type, JSON.stringify(payload, null, 2))
        eventBus.emit(type, payload)
    }
    return es
}
