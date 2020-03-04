import React from "react";
import {Image, Text, View} from "@nodegui/react-nodegui";
import {AspectRatioMode} from "@nodegui/nodegui";
import {country} from "../../location/countries";

export type FlagProps = {
    base64: Buffer
    size: number
}

export const Flag: React.FC<FlagProps> = ({base64, size}) => {
    return (
        <Image
            size={{ width: size, height: size }}
            style={`width: ${size}; height: ${size};`}
            aspectRatioMode={AspectRatioMode.KeepAspectRatio}
            buffer={base64}/>
    )
}

export type CountryProps = {
    code: string
    flag: boolean
}

export const Country: React.FC<CountryProps> = ({code, flag}) => {
    const c = country(code)
    const flag64 = Buffer.from(c.flag, "base64")
    return (
        <View style={`
            align-items: "center";
        `}>
            {flag && (
                <Flag size={24} base64={flag64}/>
            )}
            <Text style={`
                color: #eee;
                font-size: 12px;
                margin-left: 1px;
            `}>{c.name}</Text>
        </View>

    )
}


