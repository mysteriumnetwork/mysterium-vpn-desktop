/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { platform } from "os"

export const uid = (): string => {
    let uid = 0
    // getuid only available on POSIX
    // and it's not needed on windows anyway
    if (platform() !== "win32") {
        uid = process.getuid()
    }
    return uid.toString()
}
