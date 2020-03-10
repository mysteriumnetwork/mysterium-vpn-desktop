import { ScrollArea, View } from "@nodegui/react-nodegui"
import { Proposals } from "./proposals/comp/proposals"
import React from "react"
import { winSize } from "./config"
import { ProposalsByCountry } from "./proposals/comp/proposals-by-country"

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
    width: 270;
}
#left {
    width: 250;
    background-color: #ecf0f1;
}
#right {
    height: "100%";
    background-color: "red";
}
`

export const ConnectView: React.FC = () => {
    return (
        <View id="main" styleSheet={styleSheet}>
            <View id="left">
                <ScrollArea id="scroll">
                    <View style={`width: 232;`}>
                        <ProposalsByCountry />
                    </View>
                </ScrollArea>
            </View>
            <ScrollArea id="scroll-proposals" style={`border: 0; height: "100%"; width: ${winSize.width - 255};`}>
                <View style={`width: "100%";`}>
                    <Proposals />
                </View>
            </ScrollArea>
        </View>
    )
}
