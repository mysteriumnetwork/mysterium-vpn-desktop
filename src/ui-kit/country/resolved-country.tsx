import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { Flag } from "./flag"

export type ResolvedCountryProps = {
    name: string
    flagBase64: Buffer
    containerStyle?: string
    textStyle?: string
    text?: boolean
}

export const ResolvedCountry: React.FC<ResolvedCountryProps> = ({
    name,
    flagBase64,
    containerStyle = "",
    textStyle = "",
    text = false,
}) => (
    <View style={`align-items: "center"; ${containerStyle}`}>
        <Flag size={24} imageBase64={flagBase64} />
        {text && <Text style={`font-size: 12px; margin-left: 1; ${textStyle || ""}`}>{name}</Text>}
    </View>
)
