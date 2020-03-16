import { Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { winSize } from "./config"
import { observer } from "mobx-react-lite"
import { useStores } from "./store"
import { Country } from "./ui-kit/country/country"
import { ConnectionStatus as ConnectionStatusType } from "mysterium-vpn-js/lib/connection/status"
import { ConnectDisconnectButton } from "./connection/comp/connect-disconnect-button"

export const ConnectionActiveView: React.FC = observer(() => {
    const {
        connection: { location, originalLocation, status },
    } = useStores()
    let statusText = ""
    switch (status) {
        case ConnectionStatusType.CONNECTED:
            statusText = "🔐 Your connection is secure"
            break
        case ConnectionStatusType.NOT_CONNECTED:
            statusText = "⚠️ Your connection is unprotected"
            break
        default:
            statusText = "Working on it..."
    }
    return (
        <View
            style={`
                width: ${winSize.width};
                height: ${winSize.height};
                flex-direction: "column";
                background: qlineargradient( x1:0 y1:0, x2:0 y2:1, stop:0 #7c2463, stop:1 #552462);
            `}
        >
            <Text
                style={`
                padding: 30;
                color: #fff;
                font-size: 24px;
                font-weight: normal;
                qproperty-alignment: 'AlignHCenter';
                `}
            >
                {statusText}
            </Text>
            <View
                style={`
                justify-content: "space-around";
                `}
            >
                <View
                    style={`
                    padding: 20;
                    border-radius: 32;
                    background: #fff;
                    `}
                >
                    <Country code={originalLocation?.country} text={false} />
                </View>
                <View
                    style={`
                    padding: 20;
                    border-radius: 32;
                    background: #fff;
                    `}
                >
                    <Country code={location?.country} text={false} />
                </View>
            </View>
            <View
                style={`
                justify-content: "center";
                `}
            >
                <ConnectDisconnectButton />
            </View>
        </View>
    )
})
