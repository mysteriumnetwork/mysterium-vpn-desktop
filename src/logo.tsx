import React from "react"
import {Image, View} from "@nodegui/react-nodegui"
import {fixAssetPath} from "./utils/paths";

import mystLogo from "../assets/logosm.png"

export const Logo = () => (
    <View id="container" styleSheet={styleSheet}>
        <Image id="img"
               src={fixAssetPath(mystLogo)}
               geometry={{
                   width: 150,
                   height: 150,
                   x: 600,
                   y: 120,
               }}/>
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
