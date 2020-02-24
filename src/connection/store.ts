import {observable} from "mobx";

export enum ConnectionStatus {
    Connecting = "CONNECTING",
    Connected = "CONNECTED",
    Disconnecting = "DISCONNECTING",
    Disconnected = "DISCONNECTED"
}

export class ConnectionStore {
    @observable
    loading = false
    @observable
    status = ConnectionStatus.Disconnected
}
