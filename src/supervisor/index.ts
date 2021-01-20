/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { platform } from "os"

import { DarwinWinSupervisor } from "./darwinWinSupervisor"
import { LinuxSupervisor } from "./linuxSupervisor"

export interface Supervisor {
    connect(): Promise<void>
    upgrade(): Promise<void>
    install(): Promise<void>
    killMyst(): void
    startMyst(): Promise<void>
}

const darwinWinSupervisor = new DarwinWinSupervisor()
const linuxSupervisor = new LinuxSupervisor()

export const supervisor = (): Supervisor => {
    if (["win", "darwin"].indexOf(platform()) > -1) {
        return darwinWinSupervisor
    }

    if (["linux"].indexOf(platform()) > -1) {
        return linuxSupervisor
    }

    throw new Error(`OS: ${platform()} - not supported`)
}
