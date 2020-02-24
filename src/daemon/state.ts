import {NodeHealthcheck} from "mysterium-vpn-js";
import {fulfilled, pending, rejected} from "../utils/promise-actions";
import tequilapi from "../tequila";
import {Action} from "redux-actions";

export enum DaemonStatusType {
    Up = "UP",
    Down = "DOWN"
}

export interface DaemonState {
    loading: boolean
    status: DaemonStatusType
}

export const initialDaemonState: DaemonState = {
    loading: false,
    status: DaemonStatusType.Down
}

export const HEALTHCHECK = "HEALTHCHECK"

export const actions = {
    healthcheck: () => ({
        type: HEALTHCHECK,
        payload: tequilapi.healthCheck(500)
    })
}

export default (state = initialDaemonState, action: Action<NodeHealthcheck>) => {
    switch (action.type) {
        case pending(HEALTHCHECK):
            return {
                ...state,
                loading: true,
            }
        case fulfilled(HEALTHCHECK):
            return {
                ...state,
                status: (action.payload.uptime ? DaemonStatusType.Up : DaemonStatusType.Down),
                loading: false,
            }
        case rejected(HEALTHCHECK):
            return {
                ...state,
                status: DaemonStatusType.Down,
                loading: false,
            }
        default:
            return state
    }
}
