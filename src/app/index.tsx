/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { platform } from "os"

import React from "react"
import ReactDOM from "react-dom"
import { createGlobalStyle, keyframes } from "styled-components"
import { Router } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { observer } from "mobx-react-lite"
import { createHashHistory } from "history"
import { observe } from "mobx"

import { initialize as initializeSentry } from "../shared/errors/sentry"

import { Routes } from "./navigation/components/Routes/Routes"
import { rootStore, StoreContext, useStores } from "./store"
import { synchronizedHistory } from "./navigation/routerStore"
import { greyBlue1, brandLight, brand } from "./ui-kit/colors"
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

interface GlobalStyleProps {
    showGrid: boolean
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
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
    ${(props) => {
        if (props.showGrid) {
            return `
            :root {
                --baseline: 8px;
                // --color: hsla(204, 80%, 72%, 0.5);
                --color: rgba(255, 0, 0, 0.5);
                --background-baseline: repeating-linear-gradient(
                    to bottom,
                    var(--color),
                    var(--color) 1px,
                    transparent 1px,
                    transparent var(--baseline)
                  );
            }
            html {
                background-image: var(--background-baseline);
                background-position: 0 0;
            }
            `
        }
        return ""
    }}
`

// Create main element
// const container = document.createElement("div")
// document.body.appendChild(container)

const hashHistory = createHashHistory()
const history = synchronizedHistory(hashHistory, rootStore.router)
analytics.initialize()

const App: React.FC = observer(() => {
    const root = useStores()
    return (
        <React.Fragment>
            <GlobalStyle showGrid={root.showGrid} />
            <Router history={history}>
                <StoreContext.Provider value={rootStore}>
                    <Routes />
                </StoreContext.Provider>
            </Router>
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
            <div className="baseline" />
        </React.Fragment>
    )
})

// Render components
const app = document.getElementById("app")
ReactDOM.render(<App />, app)

observe(rootStore, (change) => {
    if (change.name === "os" && app) {
        app.className = change.object[change.name]
    }
})
