import { ScrollArea, View } from "@nodegui/react-nodegui"
import { Proposals } from "./proposals/comp/proposals"
import React from "react"
import { winSize } from "./config"
import { ProposalsByCountry } from "./proposals/comp/proposals-by-country"
import { EffectiveLocation } from "./location/comp/effective-location"

export const ConnectView: React.FC = () => {
    return (
        <View
            style={`
                width: ${winSize.width};
                height: ${winSize.height};
                flex-direction: "row";
            `}
        >
            <View
                style={`
                    width: 250;
                    padding-bottom: 25;
                    flex-direction: "column";
                `}
            >
                <ScrollArea
                    style={`
                        flex: 1;
                        background-color: #ecf0f1;
                        border: 0;
                        border-right: 1px solid #ccc;
                        border-bottom: 1px solid #e9e9e9;
                    `}
                >
                    <View
                        style={`
                            padding-bottom: 15;
                            background: #fafafa;
                        `}
                    >
                        <ProposalsByCountry />
                    </View>
                </ScrollArea>
                <View
                    style={`
                        height: 65;
                        background: #fafafa;
                        border-top: 1px solid #dcdcdc;
                    `}
                >
                    <EffectiveLocation />
                </View>
            </View>
            <ScrollArea
                style={`
                    flex: 1;
                    border: 0;
                    width: ${winSize.width - 250 - 10};
                    padding-bottom: 25;
                `}
            >
                <View
                    style={`
                        flex: 1;
                        max-width: ${winSize.width - 250 - 15};
                    `}
                >
                    <Proposals />
                </View>
            </ScrollArea>
        </View>
    )
}
