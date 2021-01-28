/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { EventEmitter } from "events"

import { parseSSEResponse } from "mysterium-vpn-js"

import { log } from "./log/log"
import { sseUrl } from "./tequilapi"

export const eventBus = new EventEmitter()

export const sseConnect = (): EventSource => {
    const es = new EventSource(sseUrl)
    es.onerror = (evt): void => {
        log.error("[sse error]", evt)
    }
    es.onmessage = (evt): void => {
        const { type, payload } = parseSSEResponse(evt.data)
        log.silly("[sse message event]", type, JSON.stringify(payload, null, 2))
        eventBus.emit(type, payload)
    }
    return es
}
