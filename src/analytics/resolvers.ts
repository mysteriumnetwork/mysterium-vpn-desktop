/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { screen, BrowserWindow } from "electron"
import { machineIdSync } from "node-machine-id"

export const getScreenResolution = (window: BrowserWindow): string => {
    const display = screen.getDisplayMatching(window.getBounds())
    return `${display.size.width}x${display.size.height}`
}

export const machineId = (): string => machineIdSync()
