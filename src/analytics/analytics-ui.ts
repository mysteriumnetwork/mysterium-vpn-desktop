/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { remote } from "electron"

import { Analytics } from "./analytics"

export const analytics: Analytics = {
    setUserId: remote.getGlobal("analyticsSetUserId"),
    event: remote.getGlobal("analyticsEvent"),
    pageview: remote.getGlobal("analyticsPageview"),
}
