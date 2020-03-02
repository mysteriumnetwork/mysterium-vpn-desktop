import * as net from "net";
import {Socket} from "net";
import * as os from "os"
import {staticAssetPath} from "../utils/paths";

const sudo = require("sudo-prompt")

const mystSock = "/var/run/myst.sock"

export class Supervisor {
    conn?: Socket

    async connect() {
        console.log("Connecting to the supervisor...")
        return await new Promise(((resolve, reject) => {
            this.conn = net.createConnection(mystSock)
                .on("connect", () => {
                    console.info("Connected to: ", mystSock)
                    return resolve()
                })
                .on("data", (data: Buffer) => {
                    console.info('Server:', data.toString())
                })
                .on("error", function (data) {
                    return reject(data)
                })
        }))
    }

    async install() {
        const supervisorPath = staticAssetPath("myst_supervisor")
        const mystHome = os.homedir()
        const mystPath = staticAssetPath("myst")
        const openvpnPath = staticAssetPath("openvpn")
        return await new Promise((resolve, reject) => {
            try {
                sudo.exec(`${supervisorPath} -install -mystHome ${mystHome} -mystPath ${mystPath} -openvpnPath ${openvpnPath}`, {
                    name: "Mysterium VPN2",
                    icns: staticAssetPath("logo.icns"),
                }, (err: any, stdout: string, stderr: string) => {
                    console.log("[sudo-exec]", stdout, stderr)
                    if (err) {
                        return reject(err)
                    }
                })
            } catch (err) {
                reject(err)
            }
            const waitUntilConnected = () => {
                this.connect()
                    .then(() => resolve())
                    .catch(() => setTimeout(waitUntilConnected, 500))
            }
            setTimeout(waitUntilConnected, 500)
        })
    }

    async disconnect() {
        if (this.conn) {
            this.conn.destroy()
        }
    }

    async startMyst() {
        if (!this.conn) {
            throw new Error("Supervisor is not connected")
        }
        this.conn.write("RUN\n")
    }

    async killMyst() {
        if (!this.conn) {
            throw new Error("Supervisor is not connected")
        }
        this.conn.write("KILL\n")
    }
}

export const supervisor = new Supervisor()
