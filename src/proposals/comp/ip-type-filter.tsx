/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import * as _ from "lodash"
import { Text, View } from "@nodegui/react-nodegui"
import { observer } from "mobx-react-lite"
import { CursorShape } from "@nodegui/nodegui"

import { useStores } from "../../store"
import { textSmall } from "../../ui-kit/typography"
import { Toggle } from "../../ui-kit/toggle/toggle"
import { brand } from "../../ui-kit/colors"

const styleSheet = `
#IpTypeFilter {
    margin-top: 5;
}
#IpTypeFilter-Row-active {
    width: 220;
    height: 28;
    background: "${brand}";
    border-radius: 3px;
}
#IpTypeFilter-Row {
    width: 220;
    height: 28;
    border-radius: 3px;
}
#IpTypeFilter-Row:hover {
    background: #e6e6e6;
}
#IpTypeFilter-Row-Content {
    padding-left: 10;
    padding-right: 10;
    width: 225;
    flex-direction: "row";
    justify-content: "space-between";
}
`

export const IpTypeFilter = observer(() => {
    const { proposals } = useStores()
    const ipTypeCounts = proposals.ipTypeCounts
    if (!Object.keys(ipTypeCounts).length) {
        return <></>
    }
    return (
        <View
            style={`
            width: "100%";
            padding: 2;
            background: #fafafa;
            border: 0;
            flex-direction: column;
            `}
        >
            <Text
                style={`
                ${textSmall}
                color: #777;
                margin: 5;
            `}
            >
                IP type
            </Text>
            {Object.keys(ipTypeCounts)
                .sort()
                .map((ipType) => {
                    const toggleAction = (): void => {
                        proposals.toggleIpTypeFilter(ipType)
                    }
                    const active = proposals.filter.ipType === ipType
                    const count = ipTypeCounts[ipType]
                    const ipTypeDisplay = _.capitalize(ipType)
                    return (
                        <View
                            key={ipType}
                            cursor={CursorShape.PointingHandCursor}
                            id="IpTypeFilter"
                            styleSheet={styleSheet}
                        >
                            <Toggle
                                id={active ? "IpTypeFilter-Row-active" : "IpTypeFilter-Row"}
                                onToggle={toggleAction}
                            >
                                <View id="IpTypeFilter-Row-Content">
                                    <Text
                                        style={`
                                        color: ${active ? "white" : "inherit"};
                                        `}
                                    >
                                        {ipTypeDisplay}
                                    </Text>
                                    <Text
                                        style={`
                                        height: 28;
                                        qproperty-alignment: "AlignRight | AlignVCenter";
                                        color: ${active ? "white" : "inherit"};
                                        `}
                                    >
                                        {count}
                                    </Text>
                                </View>
                            </Toggle>
                        </View>
                    )
                })}
        </View>
    )
})
