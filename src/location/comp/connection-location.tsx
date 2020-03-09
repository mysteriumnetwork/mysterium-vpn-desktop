import React from "react"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { useStores } from "../../store"
import { Country } from "../../ui-kit/country/country"

export const ConnectionLocation = observer(() => {
    const { connection } = useStores()
    return (
        <View
            id="location"
            style={`
                width: 300;
                flex-direction: "column";
                align-items: "center";
                justify-content: "center";
            `}
        >
            <Text
                style={`
                    width: 300;
                    qproperty-alignment: AlignCenter;
                `}
            >
                {"IP: " + (connection.location?.ip || "Unknown")}
            </Text>
            <Country
                textStyle={`
                    color: "black";
                `}
                containerStyle={`
                    justify-content: "center";
                `}
                code={connection.location?.country || "unknown"}
            />
        </View>
    )
})
