/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as path from "path"

import { isDevelopment, isProduction } from "./utils/mode"

/**
 * Resolves node executable path for all supported platforms in development and production modes.
 * @return {string} Node executable path which can be used to spawn the node daemon.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mystPath = (): string | undefined => {
    if (isProduction()) {
        switch (process.platform) {
            case "darwin":
                const qodeDir = path.dirname(process.execPath) // MysteriumVPN.app/Contents/MacOS
                const appBundleRoot = path.resolve(qodeDir, "../../")
                const nodePath = "Contents/Resources/dist/node/myst"
                return path.resolve(appBundleRoot, nodePath)
            default:
                return undefined
        }
    }
    if (isDevelopment()) {
        return "./node/myst"
    }
}
