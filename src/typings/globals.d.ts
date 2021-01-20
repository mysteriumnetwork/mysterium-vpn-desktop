/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line no-restricted-imports,@typescript-eslint/no-unused-vars
import type { analytics } from "../analytics/analytics-main"
import { Supervisor } from "../supervisor"

declare global {
    namespace NodeJS {
        interface Global {
            os: Platform
            supervisor: Supervisor
            analyticsSetUserId: typeof analytics.setUserId
            analyticsEvent: typeof analytics.event
            analyticsPageview: typeof analytics.pageview
        }
    }
}
