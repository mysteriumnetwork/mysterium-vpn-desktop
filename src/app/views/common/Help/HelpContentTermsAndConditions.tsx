/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { TermsEndUser } from "@mysteriumnetwork/terms"
import ReactMarkdown from "react-markdown"
import * as termsPackageJson from "@mysteriumnetwork/terms/package.json"
import { shell } from "electron"

import { Heading2, Small } from "../../../ui-kit/typography"
import { brand } from "../../../ui-kit/colors"
import { Anchor } from "../../../ui-kit/components/Anchor"

const Title = styled(Heading2)`
    margin-bottom: 6px;
`

const TermsMeta = styled.div`
    color: ${brand};
    margin-bottom: 10px;
`

const Terms = styled.div`
    width: 325px;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0 6px;
    word-wrap: break-word;
    overflow-y: scroll;
    font-size: 13px;
    color: #fff;
    opacity: 0.7;
    user-select: text;
    -webkit-app-region: no-drag;

    ul {
        padding-inline-start: 20px;
    }
`

export const HelpContentTermsAndConditions: React.FC = observer(function HelpContentTermsAndConditions() {
    return (
        <>
            <Title>Terms & Conditions</Title>
            <TermsMeta>
                Version: {termsPackageJson.version} / Last updated: {termsPackageJson.updatedAt ?? ""}
            </TermsMeta>
            <Terms>
                <Small>
                    <ReactMarkdown
                        components={{
                            // eslint-disable-next-line react/display-name,@typescript-eslint/no-unused-vars
                            a: ({ node, ...props }) => (
                                <Anchor onClick={() => shell.openExternal(props.href as string)}>
                                    {props.href as string}
                                </Anchor>
                            ),
                        }}
                    >
                        {TermsEndUser}
                    </ReactMarkdown>
                </Small>
            </Terms>
        </>
    )
})
