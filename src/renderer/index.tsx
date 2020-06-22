/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { platform } from "os"

import React from "react"
import ReactDOM from "react-dom"
import { createGlobalStyle } from "styled-components"
import "mobx-react-lite/batchingForReactDom"
import { HashRouter } from "react-router-dom"
import { ToastProvider } from "react-toast-notifications"
import { IntercomProvider } from "react-use-intercom"
import { observer } from "mobx-react-lite"

import * as packageJson from "../../package.json"
import { Routes } from "../navigation/components/Routes/Routes"
import { initialize as initializeSentry } from "../errors/sentry"
import { useStores } from "../store"

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
            font-weight: 300;
        `
        break
    default:
        globalFontStyle = `
            font-family: sans-serif;
            font-weight: normal;
        `
}

const GlobalStyle = createGlobalStyle`
    html, body, #app {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 14px;
        ${globalFontStyle}
    }
    #app {
        display: flex;
        flex-direction: column;
    }
    img {
        user-select: none;
        user-drag: none;
    }

    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05); 
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #c1c1c1; 
    }

.intercom-messenger-frame {
        position: fixed;
        top: 0 !important;
        right: 0 !important;
        width: 400px !important;
        border-radius: 0 !important;
        height: 100% !important;
    }
    // :root {
    //     --baseline: 8px;
    //     --color: hsla(204, 80%, 72%, 0.5);
    //     --background-baseline: repeating-linear-gradient(
    //         to bottom,
    //         var(--color),
    //         var(--color) 1px,
    //         transparent 1px,
    //         transparent var(--baseline)
    //       );
    // }
    // html {
    //     background-image: var(--background-baseline);
    //     background-position: 0 0;
    // }
`

// Create main element
// const container = document.createElement("div")
// document.body.appendChild(container)

const App: React.FC = observer(() => {
    const { navigation } = useStores()
    return (
        <React.Fragment>
            <GlobalStyle />
            <HashRouter>
                <ToastProvider>
                    <IntercomProvider appId={packageJson.intercomAppId} onHide={() => navigation.openChat(false)}>
                        <Routes />
                    </IntercomProvider>
                </ToastProvider>
            </HashRouter>
            <div className="baseline" />
        </React.Fragment>
    )
})

// Render components
ReactDOM.render(<App />, document.getElementById("app"))
