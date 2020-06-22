/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useCallback, useEffect } from "react"
import styled, { createGlobalStyle } from "styled-components"
import { useIntercom } from "react-use-intercom"
import { observer } from "mobx-react-lite"

import { supportPanelSize } from "../../../config"
import { useStores } from "../../../store"

const Container = styled.div`
    width: ${supportPanelSize.width}px;
    height: 100%;
    background: linear-gradient(135deg, rgb(65, 35, 97) 0%, rgb(15, 8, 22) 100%);
`

const IntercomStyleOverride = createGlobalStyle`
    .intercom-messenger-frame {
        position: fixed;
        top: 0 !important;
        right: 0 !important;
        width: 400px !important;
        border-radius: 0 !important;
        height: 100% !important;
    }
`

export const Chat: React.FC = observer(() => {
    const { boot, show, shutdown } = useIntercom()
    const { identity, navigation } = useStores()
    const bootwithProps = useCallback(
        () =>
            boot({
                customLauncherSelector: "chat",
                hideDefaultLauncher: true,

                customAttributes: {
                    node_identity: identity.identity?.id,
                },
            }),
        [boot],
    )
    useEffect(() => {
        if (navigation.chat) {
            bootwithProps()
            show()
        } else {
            shutdown()
        }
    }, [navigation.chat])
    return (
        <Container className="chat">
            <IntercomStyleOverride />
        </Container>
    )
})
