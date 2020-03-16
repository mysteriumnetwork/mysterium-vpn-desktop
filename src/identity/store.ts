import retry from "async-retry"
import tequilapi from "../tequila"
import { action, observable, reaction } from "mobx"
import { RootStore } from "../store"
import { DaemonStatusType } from "../daemon/store"

export class IdentityStore {
    @observable
    loading = false
    @observable
    id?: string

    root: RootStore

    constructor(root: RootStore) {
        this.root = root
    }

    setupReactions(): void {
        reaction(
            () => this.root.daemon.status,
            async status => {
                if (status == DaemonStatusType.Up) {
                    await this.currentIdentity()
                } else {
                    this.setId(undefined)
                }
            },
        )
    }

    @action
    async currentIdentity(): Promise<void> {
        this.setLoading(true)
        await retry(
            async () => {
                const identity = await tequilapi.identityCurrent("")
                this.setId(identity.id)
            },
            {
                onRetry: (err: Error) => {
                    console.error("Could not get current identity", err.message)
                },
            },
        )
        this.setLoading(false)
    }

    @action
    setLoading = (b: boolean): void => {
        this.loading = b
    }

    @action
    setId = (id?: string): void => {
        this.id = id
    }
}
