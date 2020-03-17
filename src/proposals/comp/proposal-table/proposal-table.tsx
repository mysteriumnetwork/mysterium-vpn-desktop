/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { useStores } from "../../../store"
import { View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { Proposal } from "./proposal"

export const ProposalTable: React.FC = observer(() => {
    const { proposals } = useStores()
    const items = proposals.countryFiltered
    return (
        <View
            style={`
            flex: 1;
            flex-direction: column;
            padding: 0;
            padding-top: 0;
            width: 562;
            background: "white";
            `}
        >
            <View
                style={`
                width: "100%";
                flex-direction: "column";
                `}
            >
                {items.map(p => {
                    return <Proposal key={p.key} proposal={p} />
                })}
            </View>
        </View>
    )
})
