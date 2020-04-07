/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Renderer } from "@nodegui/react-nodegui"
import { QFontDatabase } from "@nodegui/nodegui"
import "mobx-react-lite/batchingOptOut"

import robotoLight from "../assets/fonts/Roboto-Light.ttf"
import robotoMedium from "../assets/fonts/Roboto-Medium.ttf"

import MainWindow from "./main-window"
import { onProcessExit } from "./utils/on-process-exit"
import { supervisor } from "./supervisor/supervisor"
import { createSystemTray } from "./tray/tray"
import { fixAssetPath } from "./utils/paths"

process.title = "MysteriumVPN"

class Root extends React.Component {
    render(): React.ReactNode {
        return <MainWindow />
    }
}

;[robotoLight, robotoMedium].forEach((font) => {
    QFontDatabase.addApplicationFont(fixAssetPath(font))
})

Renderer.render(<Root />)

createSystemTray()

// This is for hot reloading (this will be stripped off in production by webpack)
if (module.hot) {
    module.hot.accept(["./main-window"], function () {
        Renderer.forceUpdate()
    })
}

onProcessExit(async () => await supervisor.killMyst())
