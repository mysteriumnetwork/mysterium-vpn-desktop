/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum EventName {
    startup = "startup",
    connect_attempt = "connect_attempt",
    connect_success = "connect_success",
    connect_cancel = "connect_cancel",
    connect_failure = "connect_failure",
    manual_connect = "manual_connect",
    quick_connect = "quick_connect",
    disconnect_attempt = "disconnect_attempt",
    disconnect_success = "disconnect_success",
    disconnect_failure = "disconnect_failure",
    page_view = "page_view",
    balance_update = "balance_update",
}

export interface Event {
    name: EventName
    duration?: number
    balance?: number
    country?: string
    provider_id?: string
    page_title?: string
}

export interface Client {
    machine_id?: string
    app_version?: string
    os?: string
    os_version?: string
    country?: string
    consumer_id?: string
}
