/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { notarize } = require("@electron/notarize")

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json")

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context
    if (electronPlatformName !== "darwin") {
        return
    }
    if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === "false") {
        console.log("CSC_IDENTITY_AUTO_DISCOVERY is set to false, skipping notarization")
        return
    }

    const appName = context.packager.appInfo.productFilename

    return await notarize({
        appBundleId: packageJson.build.appId,
        appPath: `${appOutDir}/${appName}.app`,
        appleId: process.env.APPLEID,
        appleIdPassword: process.env.APPLEIDPASS,
        teamId: process.env.APPLETEAMID,
    })
}
