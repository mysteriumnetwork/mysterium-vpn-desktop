import tequilapi from "../tequila";
import {action, observable, reaction, when} from "mobx";
import {supervisor} from "../supervisor/supervisor";

export enum DaemonStatusType {
    Up = "UP",
    Down = "DOWN"
}

export class DaemonStore {
    @observable
    statusLoading = false
    @observable
    status = DaemonStatusType.Down

    @observable
    starting = false

    constructor() {
        setInterval(async () => {
            await this.healthcheck()
        }, 2000);
        when(() => this.status == DaemonStatusType.Down, async () => {
            await this.start()
        })
        reaction(() => this.status, async (status) => {
            if (status == DaemonStatusType.Down) {
                await this.start()
            }
        })
    }

    @action
    async healthcheck() {
        if (this.starting) {
            console.log("Daemon is starting, suspending healthcheck")
            return
        }
        this.statusLoading = true
        try {
            await tequilapi.healthCheck(100)
            this.status = DaemonStatusType.Up
        } catch (err) {
            console.error("Healthcheck failed:", err.message)
            this.status = DaemonStatusType.Down
        }
        this.statusLoading = false
    }

    @action
    async start() {
        if (this.starting) {
            console.info("Already starting")
            return
        }
        this.starting = true
        try {
            await supervisor.connect()
        } catch (err) {
            console.error("Failed to connect to the supervisor, installing", err)
            await this.supervisorInstall()
        }

        await supervisor.startMyst()
        this.starting = false
    }

    @action
    async supervisorInstall() {
        try {
            return await supervisor.install()
        } catch (err) {
            console.error("Failed to install supervisor", err)
        }
    }

}
