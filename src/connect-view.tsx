import {ScrollArea, View} from "@nodegui/react-nodegui";
import {Proposals} from "./proposals/proposals";
import {ConnectionLocation} from "./location/connection-location";
import {ConnectionStatus} from "./connection/connection-status";
import {Disconnect} from "./connection/disconnect-button";
import React from "react";
import {winSize} from "./config";
import {ConnectionStatusText} from "./connection/connection-status-text";

export const ConnectView = () => {
    return (
        <View id="main" styleSheet={styleSheet}>
            <View id="left">
                <ScrollArea id="scroll">
                    <Proposals/>
                </ScrollArea>
            </View>
            <View id="right">
                <ConnectionLocation />
                <ConnectionStatus/>
                <ConnectionStatusText/>
                <Disconnect/>
            </View>
        </View>
    )
}

//     background-color: QLinearGradient( x1: 0, y1: 0, x2: 1, y2: 0, stop: 0 #412361, stop: 1 #9b1c4d);

const styleSheet = `
#main {
    width: ${winSize.width}px;
    height: ${winSize.height}px;
    flex-direction: "row";
}
#scroll {
    border: 0;
    border-right: 1px solid #ccc;
    background-color: #ecf0f1;
    width: 310px;
}
#left {
    width: 310px;
    background-color: #ecf0f1;
}
#right {
    flex: 1;
    flex-direction: "column";
    align-items: "center";
    padding-top: 120px;
    background-color: #ecf0f1;
}
`;
