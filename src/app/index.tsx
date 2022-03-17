/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { platform } from "os"

import React from "react"
import ReactDOM from "react-dom"
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom"
import { createGlobalStyle, keyframes } from "styled-components"
import { Toaster } from "react-hot-toast"
import { createHashHistory } from "history"
import { observe } from "mobx"

import { initialize as initializeSentry } from "../shared/errors/sentry"

import { Routes } from "./navigation/components/Routes/Routes"
import { createRootStore, StoreContext } from "./store"
import { brand, brandLight, greyBlue1 } from "./ui-kit/colors"
import { analytics } from "./analytics/analytics"

initializeSentry()

let globalFontStyle
switch (platform()) {
    case "win32":
        globalFontStyle = `
            font-family: "Segoe UI", sans-serif;
            font-weight: normal;
        `
        break
    case "darwin":
        globalFontStyle = `
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-weight: 400;
        `
        break
    default:
        globalFontStyle = `
            font-family: Ubuntu, sans-serif;
            font-weight: normal;
        `
}

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const GlobalStyle = createGlobalStyle`
    html, body, #app {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 12px;
        ${globalFontStyle}
    }
    input, button {
        ${globalFontStyle}
    }
    #app {
        display: flex;
        flex-direction: column;
        animation: ${fadeIn} .5s;

        user-select: none;
        -webkit-app-region: no-drag;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05); 
    }
    ::-webkit-scrollbar-thumb {
        background: ${greyBlue1};
        &:active {
            background: ${brandLight};
        }
    }
    input[type=range] {
        -webkit-appearance: none;
    }
    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50px;
        background: ${brandLight};
        top: -6px;
        position: relative;
        &:active {
            background: ${brand};
        }
    }
    input[type=range]::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 10px;
        background: #5a2058;
    }
    :focus-visible {
        outline: 2px solid ${brandLight};
        outline-offset: 2px;
    }
`

const history = createHashHistory()
const rootStore = createRootStore(history)

analytics.initialize()

const App: React.FC = () => (
    <React.Fragment>
        <GlobalStyle />
        <HistoryRouter history={history}>
            <StoreContext.Provider value={rootStore}>
                <Routes />
            </StoreContext.Provider>
        </HistoryRouter>
        <Toaster
            position="top-right"
            gutter={40}
            containerStyle={{
                marginTop: 35,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                fontSize: 14,
            }}
            toastOptions={{
                duration: 8_000,
            }}
        />
    </React.Fragment>
)

// Render components
const app = document.getElementById("app")
ReactDOM.render(<App />, app)

observe(rootStore, (change) => {
    if (change.name === "os" && app) {
        app.className = change.object[change.name]
    }
})
