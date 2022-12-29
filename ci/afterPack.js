/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")

const chmodr = require("chmodr")
const { Arch } = require("electron-builder")

exports.default = async function afterPack(context) {
    const { electronPlatformName, appOutDir, packager, arch } = context
    if (electronPlatformName === "darwin" && arch === Arch.universal) {
        // Some files lose their attributes after app.asar merge (for macOS universal binary),
        // thus we need to set +x for the binaries
        const nodeBinDir = path.join(
            packager.getResourcesDir(appOutDir),
            "app.asar.unpacked",
            "node_modules",
            "@mysteriumnetwork",
            "node",
            "bin",
        )
        chmodr.sync(nodeBinDir, 0o755)
    }
}
