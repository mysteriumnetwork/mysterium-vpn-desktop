import {ScrollArea, View} from "@nodegui/react-nodegui";
import {Proposals} from "./proposals/proposals";
import {Logo} from "./logo";
import {ConnectionStatus} from "./connection/connection-status";
import {Disconnect} from "./connection/disconnect-button";
import React from "react";
import {winSize} from "./config";

export const ConnectView = () => {
    return (
        <View id="main" styleSheet={styleSheet}>
            <View id="left">
                <ScrollArea id="scroll">
                    <Proposals/>
                </ScrollArea>
            </View>
            <View id="right">
                <ConnectionStatus/>
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
    border: 1px;
    background-color: #ecf0f1;
}
#left {
    width: 410px;
    background-color: #ecf0f1;
}
#right {
    flex: 1;
    flex-direction: column;
    align-items: "center";
    padding-top: 120px;
    background-color: #ecf0f1;
}
#scroll {
    width: 410px;
}
#connect {
    margin-top: 30px;
}
#connectBtn {
    padding: 18px;
}
`;
