/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export interface SupervisorInterface {
    connect(): Promise<void>
    install(): Promise<void>
    disconnect(): void
    startMyst(port: number): Promise<void>
    stopMyst(): Promise<void>
    upgrade(): Promise<void>
    killGhost(port: number): Promise<void>
}
