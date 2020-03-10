import React from "react"
import { useStores } from "../../store"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { Proposal } from "./proposal"

const styleSheet = `
#container {
    flex-direction: column;
    padding: 0;
    padding-top: 0;
    width: 562;
    background: "white";
}
#container QLabel {
    font-size: 13px;
}
#header {
    width: "100%";
    padding: 10;
    border-bottom: 1px solid #dcdcdc;
}
#row {
    width: "100%";
    padding: 10;
}
#cell-country, #header-country {
    width: 50;
    justify-content: "center";
}
#cell-id, #header-id {
    width: 100;
}
#cell-id QLabel {
    font-family: "Monaco, monospace";
    font-size: 12px;
}
#cell-service-type, #header-service-type,
#cell-price-per-min, #header-price-per-min,
#cell-price-per-gib, #header-price-per-gib
 {
    width: 100;
}
`

export const Proposals = observer(() => {
    const { proposals } = useStores()
    const propsals = proposals.countryFiltered
    return (
        <View id="container" styleSheet={styleSheet} pos={{ x: -1000, y: -1000 }}>
            <View id="header">
                <View id="header-id">
                    <Text>ID</Text>
                </View>
                <View id="header-price-per-min">
                    <Text>Price/min</Text>
                </View>
                <View id="header-price-per-gib">
                    <Text>Price/GiB</Text>
                </View>
                <View id="header-service-type">
                    <Text>Service type</Text>
                </View>
            </View>
            {propsals.map(p => {
                return <Proposal key={p.key} proposal={p} />
            })}
        </View>
    )
})
