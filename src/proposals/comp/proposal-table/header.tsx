/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { Text, View } from "@nodegui/react-nodegui"

export const ProposalTableHeader: React.FC = () => (
    <View id="ProposalTable-Proposal-header-row">
        <Text id="ProposalTable-Proposal-cell">ID</Text>
        <Text id="ProposalTable-Proposal-cell">Price/min</Text>
        <Text id="ProposalTable-Proposal-cell">Price/GiB</Text>
        <Text id="ProposalTable-Proposal-cell">Service type</Text>
    </View>
)
