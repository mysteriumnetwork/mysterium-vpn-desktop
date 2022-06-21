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
import { shell } from "electron"

import { Step, useStores } from "../../../store"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { Checkbox } from "../../../ui-kit/form-components/Checkbox/Checkbox"
import { Heading1 } from "../../../ui-kit/typography"
import { bg1, brand } from "../../../ui-kit/colors"
import { Anchor } from "../../../ui-kit/components/Anchor"

const Container = styled.div`
    background: ${bg1};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    -webkit-app-region: drag;
    padding-top: 72px;
    color: #fff;
    text-align: center;
`

const Title = styled(Heading1)`
    margin-bottom: 6px;
`

const TermsMeta = styled.div`
    color: ${brand};
    margin-bottom: 10px;
`

const Terms = styled.div`
    width: 500px;
    height: 250px;
    margin: 0 auto;
    padding: 12px;
    word-wrap: break-word;
    overflow-y: scroll;
    font-size: 13px;
    user-select: text;
    -webkit-app-region: no-drag;

    > ul {
        padding-inline-start: 20px;
    }

    color: #fff;
    opacity: 0.7;
    text-align: left;
    border: 1px solid #ffffff4c;
    border-radius: 5px;
`

const TermsAgree = styled.div`
    width: 300px;
    margin: 0 auto;
    margin-top: 15px;
    input {
        margin-left: auto;
    }
    label {
        margin-right: auto;
    }
`

const Actions = styled.div`
    margin-top: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 57px;
`

export const AcceptTermsView: React.FC = observer(function AcceptTermsView() {
    const root = useStores()
    const { config } = root
    const [agree, setAgree] = useState(false)
    const onAgreeToTerms = async () => {
        await config.agreeToTerms()
        return root.startupSequence(Step.TERMS_DONE)
    }
    return (
        <Container>
            <Title>Terms and Conditions</Title>
            <TermsMeta>
                Version: {termsPackageJson.version} / Last updated: {termsPackageJson.updatedAt ?? ""}
            </TermsMeta>
            <Terms>
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
            </Terms>
            <TermsAgree>
                <Checkbox
                    checked={agree}
                    onChange={(): void => {
                        setAgree(!agree)
                    }}
                >
                    I agree to all Terms of Service
                </Checkbox>
            </TermsAgree>
            <Actions>
                <BrandButton disabled={!agree} onClick={onAgreeToTerms}>
                    Continue
                </BrandButton>
            </Actions>
        </Container>
    )
})
