/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { useLocation } from "react-router-dom"

import { WalletButton } from "./payment/comp/wallet-button"
import { useStores } from "./store"
import { Toggle } from "./ui-kit/toggle/toggle"

const Container = styled.div`
    box-sizing: border-box;
    height: 40px;
    padding: 8px 16px;
    background: linear-gradient(180deg, #d6d6d6 0%, #cccccc 97%, #bababa 100%);
    display: flex;
    justify-content: space-between;
`

export const NavBar: React.FC = observer(() => {
    const { navigation } = useStores()
    const location = useLocation()
    return (
        <Container>
            <div>
                <Toggle
                    small
                    active={location.pathname == "/proposals"}
                    onClick={(): void => navigation.navigateTo("/proposals")}
                >
                    Connect to VPN
                </Toggle>
            </div>
            <div>
                <WalletButton />
            </div>
        </Container>
    )
})

// export const ConsumerModeButton: React.FC = observer(() => {
//     const root = useStores()
//     const history = useHistory()
//     const active = root.consumer
//     const backgroundStyle = active
//         ? "background: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:0 #873a72, stop:1 #673a72);"
//         : "background: #fff;"
//     const textStyle = active ? "color: #fff;" : `color: ${brandDarker};`
//     return (
//         <Toggle
//             style={`
//              width: 168;
//              height: 26;
//              flex-direction: "row";
//              justify-content: "center";
//              padding: 2;
//              padding-left: 12;
//              padding-right: 8;
//              border-radius: 4;
//              ${backgroundStyle}
//              `}
//             onToggle={(): void => {
//                 root.navigateToConsumer()
//             }}
//         >
//             <Text style={textStyle}>Connect to VPN</Text>
//         </Toggle>
//     )
// })

// export const NavBar: React.FC = () => {
//     return (
//         <View
//             style={`
//             width: ${winSize.width};
//             height: 40;
//             padding-top: 8;
//             padding-bottom: 8;
//             padding-left: 16;
//             padding-right: 16;
//             background: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:0 #d6d6d6, stop:0.97 #ccc, stop:1 #bababa);
//             flex-direction: "row";
//             justify-content: "space-between";
//             align-items: "center";
//             `}
//         >
//             <ConsumerModeButton />
//             <WalletButton />
//         </View>
//     )
// }
