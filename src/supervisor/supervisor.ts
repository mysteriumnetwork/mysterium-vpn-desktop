/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as net from "net"
import { Socket } from "net"
import * as os from "os"

import * as sudo from "sudo-prompt"

import { staticAssetPath } from "../utils/paths"

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
        const mystHome = os.homedir()
        const mystPath = staticAssetPath("myst")
        const openvpnPath = staticAssetPath("openvpn")
        return await new Promise((resolve, reject) => {
            try {
                sudo.exec(
                    `${supervisorPath} -install -mystHome ${mystHome} -mystPath ${mystPath} -openvpnPath ${openvpnPath}`,
                    {
                        name: "MysteriumVPN",
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
        this.conn.write("RUN\n")
    }

    killMyst(): void {
        if (!this.conn) {
            throw new Error("Supervisor is not connected")
        }
        this.conn.write("KILL\n")
    }
}

export const supervisor = new Supervisor()
