import React from "react"
import {Image, View} from "@nodegui/react-nodegui"
import {fixAssetPath} from "./utils/fix-asset-url";

import mystLogo from "../assets/logo.png"

export const Logo = () => (
    <View id="container" styleSheet={styleSheet}>
        <Image id="img" src={fixAssetPath(mystLogo)} />
    </View>
)

const styleSheet = `
#container {
    height: 150px;
}
#img {
    height: 150px;
    width: 150px;
}
`

