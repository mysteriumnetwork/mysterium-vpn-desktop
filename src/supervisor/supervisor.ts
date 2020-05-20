/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as net from "net"
import { Socket } from "net"
import { userInfo } from "os"

import * as sudo from "sudo-prompt"

import * as packageJson from "../../package.json"
import { staticAssetPath } from "../utils/paths"
import { analytics } from "../analytics/analytics-main"
import { AppAction, Category } from "../analytics/analytics"

const mystSock = "/var/run/myst.sock"

export class Supervisor {
    conn?: Socket

    async connect(): Promise<void> {
        console.log("Connecting to the supervisor...")
        return await new Promise((resolve, reject) => {
            this.conn = net
                .createConnection(mystSock)
                .on("connect", () => {
                    console.info("Connected to: ", mystSock)
                    analytics.event(Category.App, AppAction.ConnectedToSupervisor)
                    return resolve()
                })
                .on("data", (data: Buffer) => {
                    console.info("Server:", data.toString())
                })
                .on("error", function (data) {
                    return reject(data)
                })
        })
    }

    async install(): Promise<void> {
        const supervisorPath = staticAssetPath("myst_supervisor")
        const mystPath = staticAssetPath("myst")
        const openvpnPath = staticAssetPath("openvpn")
        analytics.event(Category.App, AppAction.InstallSupervisor)
        return await new Promise((resolve, reject) => {
            try {
                sudo.exec(
                    `${supervisorPath} -install -mystPath ${mystPath} -openvpnPath ${openvpnPath}`,
                    {
                        name: packageJson.productName,
                        icns: staticAssetPath("logo.icns"),
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err: any, stdout: string, stderr: string) => {
                        console.log("[sudo-exec]", stdout, stderr)
                        if (err) {
                            return reject(err)
                        }
                    },
                )
            } catch (err) {
                reject(err)
            }
            const waitUntilConnected = (): void => {
                this.connect()
                    .then(() => resolve())
                    .catch(() => setTimeout(waitUntilConnected, 500))
            }
            setTimeout(waitUntilConnected, 500)
        })
    }

    disconnect(): void {
        if (this.conn) {
            this.conn.destroy()
        }
    }

    startMyst(): void {
        if (!this.conn) {
            throw new Error("Supervisor is not connected")
        }
        const user = userInfo()
        this.conn.write(`run -uid ${user.uid}\n`)
    }

    killMyst(): void {
        if (!this.conn) {
            throw new Error("Supervisor is not connected")
        }
        this.conn.write("kill\n")
    }
}

export const supervisor = new Supervisor()
