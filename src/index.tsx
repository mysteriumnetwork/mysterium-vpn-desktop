import React from "react";
import {Renderer} from "@nodegui/react-nodegui";
import MainWindow from "./main-window";
import {onProcessExit} from "./utils/on-process-exit";
import {supervisor} from "./supervisor/supervisor";

process.title = "Mysterium VPN 2";

class Root extends React.Component {
    render(): React.ReactNode {
        return (
            <MainWindow />
        )
    }
}

Renderer.render(<Root/>);

// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
    module.hot.accept(["./main-window"], function () {
        Renderer.forceUpdate();
    });
}

onProcessExit(async () => await supervisor.killMyst())
