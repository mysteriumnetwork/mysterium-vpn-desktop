/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import ReactMarkdown from "react-markdown"
import { TermsEndUser } from "@mysteriumnetwork/terms"
import * as termsPackageJson from "@mysteriumnetwork/terms/package.json"
import styled from "styled-components"

import { useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/mbutton/brand-button"
import { Checkbox } from "../../../ui-kit/Checkbox/Checkbox"

import termsBg from "./terms-bg.png"

const Container = styled.div`
    height: 100%;
    background-image: url(${termsBg});
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

const Title = styled.h1`
    margin-top: 0;
    padding-top: 32px;
    text-align: center;
    font-weight: 300;
    font-size: 24px;
    color: #632462;
`

const Version = styled.p`
    text-align: center;
    font-size: 12px;
    color: #999999;
`

const Terms = styled.div`
    width: 300px;
    height: 288px;
    margin: 0 auto;
    padding: 15px;
    word-wrap: break-word;
    overflow-y: scroll;
    font-size: 13px;
    border: 1px solid #e9e9e9;
    background-color: #fafafa;

    > ul {
        padding-inline-start: 20px;
    }
`

const BottomBar = styled.div`
    height: 72px;
    margin-top: auto;
    margin-right: 24px;
    padding-left: 208px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const AcceptTermsView: React.FC = observer(({}) => {
    const { config } = useStores()
    const [agree, setAgree] = useState(false)
    return (
        <Container>
            <Title>Terms and Conditions</Title>
            <Version>
                Version: {termsPackageJson.version} / Last updated: {termsPackageJson.updatedAt ?? ""}
            </Version>
            <Terms>
                <ReactMarkdown source={TermsEndUser} />
            </Terms>
            <BottomBar>
                <Checkbox checked={agree} onChange={(): void => setAgree(!agree)}>
                    I agree to all Terms of Service
                </Checkbox>
                <BrandButton
                    disabled={!agree}
                    onClick={(): void => {
                        config.agreeToTerms()
                    }}
                >
                    Continue
                </BrandButton>
            </BottomBar>
        </Container>
    )
})
