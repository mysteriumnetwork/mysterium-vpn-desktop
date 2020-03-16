import { ScrollArea, View } from "@nodegui/react-nodegui"
import { ProposalTable } from "./proposals/comp/proposal-table/proposal-table"
import React from "react"
import { winSize } from "./config"
import { CountryFilter } from "./proposals/comp/country-filter"
import { SelectedProposal } from "./proposals/comp/selected-proposal"
import { ProposalTableHeader } from "./proposals/comp/proposal-table/header"
import { OriginalLocation } from "./location/comp/original-location"

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
                        border-right: 1px solid #e9e9e9;
                    `}
                >
                    <View
                        style={`
                            padding-bottom: 15;
                            background: #fafafa;
                        `}
                    >
                        <CountryFilter />
                    </View>
                </ScrollArea>
                <View
                    style={`
                        height: 65;
                        background: #fafafa;
                        border-top: 1px solid #e9e9e9;
                        border-right: 1px solid #e9e9e9;
                    `}
                >
                    <OriginalLocation />
                </View>
            </View>
            <View
                style={`
                    width: ${winSize.width - 250};
                    padding-bottom: 25;
                    flex-direction: "column";
                    background: #fff;
                `}
            >
                <ProposalTableHeader />
                <ScrollArea
                    style={`
                    flex: 1;
                    border: 0;
                    background: #fff;
                `}
                >
                    <View
                        style={`
                        flex: 1;
                        max-width: ${winSize.width - 250 - 15};
                    `}
                    >
                        <ProposalTable />
                    </View>
                </ScrollArea>
                <View
                    style={`
                        max-height: 65;
                        border-top: 1px solid #e9e9e9;
                    `}
                >
                    <SelectedProposal />
                </View>
            </View>
        </View>
    )
}
