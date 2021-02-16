/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Supervisor } from "../supervisor/supervisor"

declare global {
    namespace NodeJS {
        interface Global {
            os: Platform
            supervisor: Supervisor
            machineId: string
        }
    }
}
