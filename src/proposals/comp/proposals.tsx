import React from "react"
import { useStores } from "../../store"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { Proposal as ProposalType } from "mysterium-vpn-js/lib/proposal/proposal"
import { mystDisplay, pricePerGiB, pricePerMinute } from "mysterium-vpn-js"

const timeRate = (p: ProposalType): number | undefined => {
    if (!p.paymentMethod) {
        return undefined
    }
    return mystDisplay(pricePerMinute(p.paymentMethod))
}

const trafficRate = (p: ProposalType): number | undefined => {
    if (!p.paymentMethod) {
        return undefined
    }
    return mystDisplay(pricePerGiB(p.paymentMethod))
}

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
}
#cell-service-type, #header-service-type,
#cell-price-per-min, #header-price-per-min,
#cell-price-per-gib, #header-price-per-gib
 {
    width: 100;
}
#country-container {
    flex-direction: column;
}
#country {
    padding: 10;
    height: 40px;
    border-bottom: 1px solid #666;
    border-top: 1px solid #656565;
    align-items: "center";
}
#country-proposals {
    flex-direction: column;
}
`

export const Proposals = observer(() => {
    const { proposals } = useStores()
    const byFilter = proposals.byFilter
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
            {byFilter.map(p => {
                return (
                    <View id="row" key={p.key}>
                        <View id="cell-id">
                            <Text>{p.id10}</Text>
                        </View>
                        <View id="cell-price-per-min">
                            <Text>{timeRate(p)}</Text>
                        </View>
                        <View id="cell-price-per-gib">
                            <Text>{trafficRate(p)}</Text>
                        </View>
                        <View id="cell-service-type">
                            <Text>{p.serviceType4}</Text>
                        </View>
                    </View>
                )
            })}
        </View>
    )
})
