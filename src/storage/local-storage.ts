/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const loadJSON = <T>(key: string, fallback: () => T): T => {
    const value = localStorage.getItem(key)
    if (!value) {
        return fallback()
    }
    return JSON.parse(value) as T
}

export const storeJSON = (key: string, value: unknown): void => {
    if (typeof value === "string") {
        localStorage.setItem(key, value)
        return
    }
    localStorage.setItem(key, JSON.stringify(value))
}
