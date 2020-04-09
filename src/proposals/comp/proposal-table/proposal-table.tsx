/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { ScrollArea, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"
import { winSize } from "../../../config"
import { brand } from "../../../ui-kit/colors"

import { Proposal } from "./proposal"
import { ProposalTableHeader } from "./header"

const ConnectedProposalTable: React.FC = observer(() => {
    const { proposals } = useStores()
    const items = proposals.filteredProposals
    return (
        <>
            {items.map((p) => {
                return <Proposal key={p.key} proposal={p} />
            })}
        </>
    )
})

const styleSheet = `
#ProposalTable {
    flex: 1;
    width: "100%";
    flex-direction: column;
}
#ProposalTable-ScrollArea {
    flex: 1;
    border: 0;
    background: #fff;
}
#ProposalTableBody {
    flex: 1;
    max-width: ${winSize.width - 240 - 15};
    flex-direction: column;
    background: "white";
}
#ProposalTable-Proposal-row-outer {
    padding: 2;
}
#ProposalTable-Proposal-header-row {
    width: "100%"; 
    padding: 10;
    padding-right: 30;
    border-bottom: 1px solid #dcdcdc;
}
#ProposalTable-Proposal-row {
    width: "100%";
    padding: 10;
}
#ProposalTable-Proposal-cell {
    width: 100;
    color: "inherit";
}
#ProposalTable-Proposal-cell-active {
    width: 100;
    color: "white";
}
#ProposalTable-Proposal-Toggle-active {
    background: "${brand}";
    border-radius: 3px;
}
#ProposalTable-Proposal-Toggle-inactive {
    border-radius: 3px;
}
#ProposalTable-Proposal-Toggle-inactive:hover {
    background: #e6e6e6;
}
`

export const ProposalTable: React.FC = () => {
    return (
        <View id="ProposalTable" styleSheet={styleSheet}>
            <ProposalTableHeader />
            <ScrollArea id="ProposalTable-ScrollArea">
                <View id="ProposalTableBody">
                    <ConnectedProposalTable />
                </View>
            </ScrollArea>
        </View>
    )
}
