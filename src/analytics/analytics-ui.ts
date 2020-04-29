/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { remote } from "electron"

import { setUserId, event, pageview } from "./analytics-main"

export const analytics = {
    setUserId: remote.getGlobal("analyticsSetUserId") as typeof setUserId,
    event: remote.getGlobal("analyticsEvent") as typeof event,
    pageview: remote.getGlobal("analyticsPageview") as typeof pageview,
}
