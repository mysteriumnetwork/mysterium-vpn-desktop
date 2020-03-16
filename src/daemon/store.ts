import tequilapi from "../tequila"
import { action, observable, reaction, when } from "mobx"
import { supervisor } from "../supervisor/supervisor"

export enum DaemonStatusType {
    Up = "UP",
    Down = "DOWN",
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
        }, 2000)
        when(
            () => this.status == DaemonStatusType.Down,
            async () => {
                await this.start()
            },
        )
        reaction(
            () => this.status,
            async status => {
                if (status == DaemonStatusType.Down) {
                    await this.start()
                }
            },
        )
    }

    @action
    async healthcheck(): Promise<void> {
        if (this.starting) {
            console.log("Daemon is starting, suspending healthcheck")
            return
        }
        this.setStatusLoading(true)
        try {
            await tequilapi.healthCheck(100)
            this.setStatus(DaemonStatusType.Up)
        } catch (err) {
            console.error("Healthcheck failed:", err.message)
            this.setStatus(DaemonStatusType.Down)
        }
        this.setStatusLoading(false)
    }

    @action
    async start(): Promise<void> {
        if (this.starting) {
            console.info("Already starting")
            return
        }
        this.setStarting(true)
        try {
            await supervisor.connect()
        } catch (err) {
            console.error("Failed to connect to the supervisor, installing", err.message)
            await this.supervisorInstall()
        }

        await supervisor.startMyst()
        this.setStarting(false)
    }

    @action
    async supervisorInstall(): Promise<void> {
        try {
            return await supervisor.install()
        } catch (err) {
            console.error("Failed to install supervisor", err)
        }
    }

    @action
    setStatus = (s: DaemonStatusType): void => {
        this.status = s
    }

    @action
    setStarting = (s: boolean): void => {
        this.starting = s
    }

    @action
    setStatusLoading = (s: boolean): void => {
        this.statusLoading = s
    }
}
