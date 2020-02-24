import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {DefaultRootState} from "react-redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware"
import {DaemonState} from "./daemon/state";
import daemonReducer from "./daemon/state"
import {createLogger} from "redux-logger"

type ConnectionStatus = 'Connecting' | 'Connected' | 'Disconnecting' | 'Disconnected'

export interface State {
    daemon: DaemonState
    connection: {
        status: ConnectionStatus
    }
}

declare module "react-redux" {
    export interface DefaultRootState extends State {
    }
}


const logger = createLogger({
    level: 'info',
    collapsed: true,
});

export const store = createStore(
    combineReducers({
        daemon: daemonReducer
    }),
    {},
    compose(applyMiddleware(thunk, promise, logger))
)
