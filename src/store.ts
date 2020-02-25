import {DaemonStore} from "./daemon/store";
import {ConnectionStore} from "./connection/store";
import React from "react";
import {IdentityStore} from "./identity/store";

export class RootStore {
    daemon: DaemonStore
    connection: ConnectionStore
    identity: IdentityStore

    constructor() {
        this.daemon = new DaemonStore();
        this.connection = new ConnectionStore();
        this.identity = new IdentityStore(this);
    }
}

export const storesContext = React.createContext(new RootStore())

export const useStores = () => React.useContext(storesContext)
