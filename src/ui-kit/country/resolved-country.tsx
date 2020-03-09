import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { Flag } from "./flag"

export type ResolvedCountryProps = {
    name: string
    flagBase64: Buffer
    containerStyle?: string
    textStyle?: string
}

export const ResolvedCountry: React.FC<ResolvedCountryProps> = ({ name, flagBase64, containerStyle, textStyle }) => (
    <View style={`align-items: "center"; ${containerStyle || ""}`}>
        <Flag size={24} imageBase64={flagBase64} />
        <Text style={`color: #eee; font-size: 12px; margin-left: 1; ${textStyle || ""}`}>{name}</Text>
    </View>
)
