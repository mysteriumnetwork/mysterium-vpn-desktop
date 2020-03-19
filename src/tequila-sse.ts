/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import EventSource from "eventsource"
import { EventEmitter } from "events"
import { ConnectionStatistics, ConnectionStatus, Proposal } from "mysterium-vpn-js"
import { isDevelopment } from "./utils/mode"
import { tequilaBase } from "./tequila"
import { camelKeys } from "./utils/json"

export type AppState = {
    consumer: {
        connection: {
            state: ConnectionStatus
            statistics?: ConnectionStatistics
            proposal?: Proposal
        }
    }
}

export const eventBus = new EventEmitter()

export const AppStateChangeEvent = "state-change"

export type SSEResponse = {
    type: string
    payload: AppState
}

export const sseConnect = (): EventSource => {
    const es = new EventSource(`${tequilaBase}/events/state`)
    es.onerror = (evt): void => {
        console.error("[sse error]", evt)
    }
    es.onmessage = (evt): void => {
        const { type, payload }: SSEResponse = camelKeys(typeof evt.data === "string" ? JSON.parse(evt.data) : evt.data)
        if (isDevelopment()) {
            console.log("[sse message event]", type, JSON.stringify(payload, null, 2))
        }
        eventBus.emit(type, payload)
    }
    return es
}
