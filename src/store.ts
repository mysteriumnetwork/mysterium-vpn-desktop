import {DaemonStore} from "./daemon/store";
import {ConnectionStore} from "./connection/store";
import React from "react";
import {IdentityStore} from "./identity/store";
import {ProposalStore} from "./proposals/store";

export class RootStore {
    daemon: DaemonStore
    connection: ConnectionStore
    identity: IdentityStore
    proposals: ProposalStore

    constructor() {
        this.daemon = new DaemonStore();
        this.connection = new ConnectionStore(this);
        this.identity = new IdentityStore(this);
        this.proposals = new ProposalStore(this)

        // Setup cross-store reactions after all injections.
        this.connection.setupReactions()
        this.identity.setupReactions()
        this.proposals.setupReactions()
    }
}

export const storesContext = React.createContext(new RootStore())

export const useStores = () => React.useContext(storesContext)
