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
import glob from "glob";
import { basename } from "path";

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

let binarySearchPath;
switch (platform()) {
    case "win32":
        binarySearchPath = "./dist/*.exe"
        break
    case "linux":
        binarySearchPath = "./dist/*.deb"
        break
    case "darwin":
        binarySearchPath = "./dist/*.dmg"
        break
    default:
        throw new Error("Platform is not supported: " + platform())
}

const matches = glob.sync(binarySearchPath)
if (!matches.length) {
    throw new Error("Binary not found")
}
const binaryPath = matches[0]
const binaryBasename = basename(binaryPath)

// Upload to nightly releases
const data = fs.readFileSync(binaryPath)
await octokit.repos.uploadReleaseAsset({
    owner: "mysteriumnetwork",
    repo: "nightly",
    release_id: nightlyReleaseId,
    name: binaryBasename,
    mediaType: {
        format: "application/octet-stream",
    },
    data,
})
