/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as Sentry from "@sentry/electron"

import * as packageJson from "../../../package.json"

export const initialize = (): void => {
    Sentry.init({
        dsn: packageJson.sentryDsn,
        release: `${packageJson.productName}@${packageJson.version}`,
    })
}
