/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { SupervisorInterface } from "../shared/supervisor"

declare global {
    namespace NodeJS {
        interface Global {
            os: Platform
            supervisor: SupervisorInterface
            machineId: string
        }
    }
}
