/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { execSync } from "child_process";
import { platform } from "os";
import * as fs from "fs";
import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})
const nightlyReleaseId = await octokit.repos.getLatestRelease({
    owner: "mysteriumnetwork",
    repo: "nightly"
}).then(rel => rel.data.id)

const nightlyVersion = (() => {
    const now = new Date()
    return (
        ("0" + now.getDate()).slice(-2)+
        ("0" + (now.getMonth()+1)).slice(-2)+
        (now.getFullYear())
    )
})()

switch (platform()) {
    case "darwin":
        process.env["CSC_LINK"] = process.env.MAC_CERTS
        process.env["CSC_KEY_PASSWORD"] = process.env.MAC_CERTS_PASSWORD
        break
    case "win32":
        process.env["CSC_LINK"] = process.env.WINDOWS_CERTS
        process.env["CSC_KEY_PASSWORD"] = process.env.WINDOWS_CERTS_PASSWORD
        break
}

// Set package version
const newVersion = `0.0.0-testnet3-${nightlyVersion}`
execSync(`yarn version --no-git-tag-version --new-version ${newVersion}`, { stdio: "inherit" })
// Bundle
execSync(`yarn bundle --publish=never`, { stdio: "inherit" })

let binaryFilename;
switch (platform()) {
    case "win32":
        binaryFilename = `mysterium-vpn-desktop_${newVersion}_amd64.exe`
        break
    case "linux":
        binaryFilename = `mysterium-vpn-desktop_${newVersion}_amd64.deb`
        break
    case "darwin":
        binaryFilename = `mysterium-vpn-desktop_${newVersion}_amd64.dmg`
        break
    default:
        throw new Error("Platform is not supported: " + platform())
}

// Upload to nightly releases
const data = fs.readFileSync(`dist/${binaryFilename}`)
await octokit.repos.uploadReleaseAsset({
    owner: "mysteriumnetwork",
    repo: "nightly",
    release_id: nightlyReleaseId,
    name: binaryFilename,
    mediaType: {
        format: "application/octet-stream",
    },
    data,
})
