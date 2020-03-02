import {Renderer} from "@nodegui/react-nodegui";
import React from "react";
import App from "./main-window";
import {onProcessExit} from "./utils/on-process-exit";
import {supervisor} from "./supervisor/supervisor";

process.title = "Mysterium VPN 2";

class Root extends React.Component {
    render(): React.ReactNode {
        return (
            <App />
        )
    }
}

Renderer.render(<Root/>);

// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
    module.hot.accept(["./app"], function () {
        Renderer.forceUpdate();
    });
}

onProcessExit(async () => await supervisor.killMyst())
