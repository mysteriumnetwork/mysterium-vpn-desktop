import {Renderer} from "@nodegui/react-nodegui";
import React from "react";
import App from "./app";
import {launchDaemon} from "./node-launcher";
import {store} from "./state";
import {actions} from "./daemon/state";
import {Dispatch} from "redux";
import {registerExitHooks} from "./utils/spawn-child";

process.title = "Mysterium VPN 2";

Renderer.render(<App/>);
// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
    module.hot.accept(["./app", "./state"], function () {
        Renderer.forceUpdate();
    });
}

registerExitHooks()
launchDaemon()

let timer: any = null;
const start = () => (dispatch: Dispatch) => {
    clearInterval(timer)
    timer = setInterval(() => dispatch(tick()), 1000)
    dispatch({type: "TIMER_START"})
    dispatch(tick())
}

const tick = () => actions.healthcheck()

// const stopTimer = () => {
//     clearInterval(timer)
//     return {type: "TIMER_STOP"}
// }


store.dispatch(start() as any)
