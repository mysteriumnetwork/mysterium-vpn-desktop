/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ipcRenderer } from "electron"
import _ from "lodash"

import { MainIpcListenChannels } from "../../shared/ipc"

const memoizedDebounced = function (func: (param: string) => void, wait = 0, options = {}) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mem = _.memoize(function (param: string) {
        return _.debounce(func, wait, options)
    })
    return function (param: string) {
        mem(param)(param)
    }
}

export const subscribePush = (topic: string): void =>
    memoizedDebounced(
        (t: string) => {
            ipcRenderer.send(MainIpcListenChannels.PushSubscribe, t)
        },
        60 * 60_000,
        { leading: true },
    )(topic)
export const unsubscribePush = (topic: string): void =>
    memoizedDebounced(
        (t: string) => {
            ipcRenderer.send(MainIpcListenChannels.PushUnsubscribe, t)
        },
        60 * 60_000,
        { leading: true },
    )(topic)
