/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Text, View } from "@nodegui/react-nodegui"
import React from "react"
import { observer } from "mobx-react-lite"

import { winSize } from "../../../config"
import { useStores } from "../../../store"
import { brand } from "../../../ui-kit/colors"
import { textHuge } from "../../../ui-kit/typography"

const styleSheet = `
#IdentitySelect {
    width: ${winSize.width};
    height: ${winSize.height};
    flex-direction: "column";
    background: #fff;
}
#IdentitySelect-Toggle-active {
    background: ${brand};
    border-radius: 3px;
    padding: 10;
    flex-direction: "row";
}
#IdentitySelect-Toggle-active-text {
    color: #fff;
}
#IdentitySelect-Toggle-inactive {
    border-radius: 3px;
    padding: 10;
    flex-direction: "row";
}
#IdentitySelect-Toggle-inactive-text {
    color: "inherit";
}
`

export const SelectIdentityView: React.FC = observer(() => {
    const { identity } = useStores()
    return (
        <View id="IdentitySelect" styleSheet={styleSheet}>
            <View
                style={`
                padding: 32;
                `}
            >
                <Text
                    style={`
                    ${textHuge};
                    color: "${brand}";
                    `}
                >
                    Registering identity...
                </Text>
            </View>
            <View
                style={`
                flex-direction: "column";
                padding-left: 32;
                padding-right: 32;
            `}
            >
                {identity.identity && (
                    <Text>{`${identity.identity.id} | ${identity.identity.registrationStatus}`}</Text>
                )}
            </View>
        </View>
    )
})
