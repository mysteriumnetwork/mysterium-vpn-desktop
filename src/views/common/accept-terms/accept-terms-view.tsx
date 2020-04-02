/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { CheckBox, ScrollArea, Text, View } from "@nodegui/react-nodegui"
import React, { useState } from "react"
import { ViewProps, WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView"
import { observer } from "mobx-react-lite"
import showdown from "showdown"
import { TermsEndUser } from "@mysteriumnetwork/terms"
import * as termsPackageJson from "@mysteriumnetwork/terms/package.json"
import { CheckState } from "@nodegui/nodegui"

import { fixAssetPath } from "../../../utils/paths"
import { textHuge } from "../../../ui-kit/typography"
import { brand } from "../../../ui-kit/colors"
import { winSize } from "../../../config"
import { useStores } from "../../../store"
import { Space } from "../../../ui-kit/space/space"
import { BrandButton } from "../../../ui-kit/mbutton/brand-button"

import termsBg from "./terms-bg.png"

const md = new showdown.Converter()

export const AcceptTermsView: React.FC<ViewProps<WidgetEventListeners>> = observer(({ style, ...rest }) => {
    const { config } = useStores()
    const [agree, setAgree] = useState(false)
    const termsHtml = md.makeHtml(TermsEndUser)
    const version = `<i>Version: ${termsPackageJson.version}<br>Last updated: ${termsPackageJson.updatedAt ?? ""}</i>`
    const termsHeight = 5520 // ACHTUNG! Adjust as needed to fit all of the text.
    return (
        <View
            style={`
            background: "red";
            background: url("${fixAssetPath(termsBg)}") #2e265e;
            background-repeat: none;
            flex-direction: "column";
            align-items: "center";
            ${style}
            `}
            {...rest}
        >
            <Text
                style={`
                    height: 60;
                    qproperty-alignment: AlignBottom;
                    ${textHuge}
                    color: ${brand};
                    `}
            >
                Terms and conditions
            </Text>
            <View
                style={`
                width: "100%";
                padding-left: 180;
                height: ${winSize.height - 60 - 72};
                padding: 24;
                `}
            >
                <ScrollArea
                    style={`
                        flex: 1;
                        background-color: #ecf0f1;
                        border: 1px solid #e9e9e9;
                    `}
                >
                    <View
                        style={`
                            width: 100;
                            background: #fafafa;
                            flex-direction: "column";
                        `}
                    >
                        <Text
                            style={`
                            color: #333;
                            padding-top: 15;
                            padding-left: 15;
                            `}
                        >
                            {version}
                        </Text>
                        <Text
                            style={`
                            padding: 15;
                            height: ${termsHeight};
                            qproperty-alignment: AlignTop;
                            `}
                            wordWrap
                        >
                            {termsHtml}
                        </Text>
                    </View>
                </ScrollArea>
            </View>
            <View
                style={`
                width: "100%";
                height: 72;
                flex-direction: "row";
                justify-content: "space-between";
                `}
            >
                <Space x={150} />
                <CheckBox
                    on={{
                        ["stateChanged"]: (state: CheckState): void => {
                            setAgree(state == CheckState.Checked)
                        },
                    }}
                    text="I agree to all Terms of Service"
                />
                <View
                    style={`
                    padding-right: 24;
                    `}
                >
                    <BrandButton
                        enabled={agree}
                        text="Continue"
                        onClick={(): void => {
                            config.agreeToTerms()
                        }}
                    />
                </View>
            </View>
        </View>
    )
})
