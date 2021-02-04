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
import * as _ from "lodash"

import { useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { Checkbox } from "../../../ui-kit/form-components/Checkbox/Checkbox"
import { Category, OnboardingAction } from "../../../analytics/analytics"
import { analytics } from "../../../analytics/analytics-ui"

import termsBg from "./terms-bg.png"

const Container = styled.div`
    background: url(${termsBg}) no-repeat, #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    -webkit-app-region: drag;
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
    background-color: #fff;
    user-select: text;
    -webkit-app-region: no-drag;

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
    -webkit-app-region: no-drag;
`

export const AcceptTermsView: React.FC = observer(({}) => {
    const { config } = useStores()
    const [agree, setAgree] = useState(false)
    const scrollAnalyticsDebounced = _.debounce((): void => {
        analytics.event(Category.Onboarding, OnboardingAction.ScrollTerms)
    }, 1000)
    return (
        <Container>
            <Title>Terms and Conditions</Title>
            <Version>
                Version: {termsPackageJson.version} / Last updated: {termsPackageJson.updatedAt ?? ""}
            </Version>
            <Terms onScroll={scrollAnalyticsDebounced}>
                <ReactMarkdown source={TermsEndUser} />
            </Terms>
            <BottomBar>
                <Checkbox
                    checked={agree}
                    onChange={(): void => {
                        setAgree(!agree)
                        analytics.event(Category.Onboarding, OnboardingAction.CheckBoxAgreeToTerms)
                    }}
                >
                    I agree to all Terms of Service
                </Checkbox>
                <BrandButton
                    disabled={!agree}
                    onClick={(): void => {
                        config.agreeToTerms()
                        analytics.event(Category.Onboarding, OnboardingAction.AcceptTerms)
                    }}
                >
                    Continue
                </BrandButton>
            </BottomBar>
        </Container>
    )
})
