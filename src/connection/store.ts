import {observable} from "mobx";

export enum ConnectionStatusType {
    Connecting = "CONNECTING",
    Connected = "CONNECTED",
    Disconnecting = "DISCONNECTING",
    Disconnected = "DISCONNECTED"
}

export class ConnectionStore {
    @observable
    loading = false
    @observable
    status = ConnectionStatusType.Disconnected
}
