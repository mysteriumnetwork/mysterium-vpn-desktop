import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { proposalsCellStyle } from "./style"

export const ProposalTableHeader: React.FC = () => (
    <View
        style={`
        width: "100%"; 
        padding: 10;
        border-bottom: 1px solid #dcdcdc;
        `}
    >
        <View style={proposalsCellStyle}>
            <Text>ID</Text>
        </View>
        <View style={proposalsCellStyle}>
            <Text>Price/min</Text>
        </View>
        <View style={proposalsCellStyle}>
            <Text>Price/GiB</Text>
        </View>
        <View style={proposalsCellStyle}>
            <Text>Service type</Text>
        </View>
    </View>
)
