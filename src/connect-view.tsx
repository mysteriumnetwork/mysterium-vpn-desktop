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
                <ScrollArea id="scroll" style="border: 1px;">
                    <Proposals/>
                </ScrollArea>
            </View>
            <View id="right">
                <Logo/>
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
    background: "white";
    flex-direction: "row";
}
#left {
    width: 410px;
    background-color: #fafafa;
}
#right {
    flex: 1;
    flex-direction: column;
    align-items: "center";
    padding-top: 120px;
    background-color: #f0f0f0;
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
