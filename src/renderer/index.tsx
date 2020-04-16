/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import path from "path"
import fs from "fs"

import React from "react"
import ReactDOM from "react-dom"
import { createGlobalStyle } from "styled-components"

import "mobx-react-lite/batchingForReactDom"
import { Routes } from "../navigation/routes"
import { onProcessExit } from "../utils/on-process-exit"
import { supervisor } from "../supervisor/supervisor"

const robotoLightPath = path.join(__static, "/fonts/Roboto-Light.ttf")
const robotoLightBuffer = fs.readFileSync(robotoLightPath)
const robotoLight = new FontFace("Roboto", robotoLightBuffer, { weight: "normal" })
robotoLight.load().then(() => {
    document.fonts.add(robotoLight)
})

const robotoMediumPath = path.join(__static, "/fonts/Roboto-Medium.ttf")
const robotoMediumBuffer = fs.readFileSync(robotoMediumPath)
const robotoMedium = new FontFace("Roboto", robotoMediumBuffer, { weight: "bold" })
robotoLight.load().then(() => {
    document.fonts.add(robotoMedium)
})

const GlobalStyle = createGlobalStyle`
    html, body, #app {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 14px;
        font-family: Roboto;
        font-weight: 300;
    }
    #app {
        display: flex;
        flex-direction: column;
    }
    img {
        user-select: none;
        user-drag: none;
    }
`

// Create main element
// const container = document.createElement("div")
// document.body.appendChild(container)

const App: React.FC = () => {
    return (
        <React.Fragment>
            <GlobalStyle />
            <Routes />
        </React.Fragment>
    )
}

// Render components
ReactDOM.render(<App />, document.getElementById("app"))

onProcessExit(async () => await supervisor.killMyst())
