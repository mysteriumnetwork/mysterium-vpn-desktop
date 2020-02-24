import {Renderer} from "@nodegui/react-nodegui";
import React from "react";
import App from "./app";
import {launchDaemon} from "./node-launcher";
import {registerExitHooks} from "./utils/spawn-child";

process.title = "Mysterium VPN 2";

Renderer.render(<App/>);
// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
    module.hot.accept(["./app", "./store"], function () {
        Renderer.forceUpdate();
    });
}

registerExitHooks()
launchDaemon()
