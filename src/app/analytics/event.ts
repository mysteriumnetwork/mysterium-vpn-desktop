/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum Event {
    startup = "startup",
    connect_attempt = "connect_attempt",
    connect_success = "connect_success",
    connect_failure = "connect_failure",
    manual_connect = "manual_connect",
    quick_connect = "quick_connect",
    disconnect_attempt = "disconnect_attempt",
    disconnect_success = "disconnect_success",
    disconnect_failure = "disconnect_failure",
    page_view = "page_view",
    balance_update = "balance_update",
}
