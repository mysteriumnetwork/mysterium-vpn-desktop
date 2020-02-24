import {hot, useEventHandler, View, Window} from "@nodegui/react-nodegui";
import React from "react";
import {QIcon, WidgetEventTypes} from "@nodegui/nodegui";
import mystLogo from "../assets/logo.svg";
import {ConnectionStatus} from "./connection/connection-status";
import {DaemonStatus} from "./daemon/daemon-status";

const minSize = {width: 900, height: 520};
const winIcon = new QIcon(mystLogo);

const App = () => {
    const mainWindowEvents = useEventHandler({
        [WidgetEventTypes.Close]: () => {
            process.exit()
        }
    }, [])
    return (
        <Window
            on={mainWindowEvents}
            windowIcon={winIcon}
            windowTitle="Mysterium VPN 2"
            minSize={minSize}
            maxSize={minSize}
            styleSheet={styleSheet}
        >
            <View style={containerStyle}>
                <DaemonStatus/>
                <ConnectionStatus/>
            </View>
        </Window>
    );
}

const containerStyle = `
  flex: 1;
`;

const styleSheet = `
  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }
  #step-1, #step-2 {
    font-size: 18px;
    padding-top: 10px;
    padding-horizontal: 20px;
  }
`;

export default hot(App);
