/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useRef } from "react"
import styled from "styled-components"
import { faBug } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { observer } from "mobx-react-lite"

import { textHuge, textSmall } from "../../../ui-kit/typography"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { TextArea } from "../../../ui-kit/form-components/TextArea"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { useStores } from "../../../store"

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: #fff;
`

const Title = styled.div`
    padding-top: 12px;
    ${textHuge};
    text-align: center;
`

const Icon = styled(FontAwesomeIcon)`
    margin-right: 12px;
`

const Form = styled.div`
    width: 400px;
    margin: 32px auto;
`

const InputDescription = styled.div`
    ${textSmall};
    color: #404040;
`

const DescriptionInput = styled(TextArea)`
    margin-top: 16px;
    max-width: 400px;
    max-height: 200px;
    height: 200px;
    resize: none;
`

const FormControls = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`

export const ReportIssueView: React.FC = observer(() => {
    const { feedback, navigation } = useStores()
    const email = useRef<HTMLInputElement>(null)
    const description = useRef<HTMLTextAreaElement>(null)
    const submit = async () => {
        await feedback.reportIssue({
            email: email.current?.value,
            description: description.current?.value ?? "",
        })
        navigation.openReportIssue(false)
    }
    return (
        <Container>
            <Title>
                <Icon icon={faBug} size="lg" color="#404040" />
                Report an issue
            </Title>
            <Form>
                <TextInput placeholder="E-mail (optional)" ref={email} />
                <InputDescription>
                    Your email may be used by our support/dev team to contact you regarding the issue.
                </InputDescription>
                <DescriptionInput placeholder="Describe the issue" ref={description} />
                <InputDescription>
                    Description and <strong>application logs</strong> will be attached to the issue.
                    <br />
                    Logs may include sensitive information, such as IP address and location. It will be only accessible
                    and used by the dev team to address the issue you are having.
                </InputDescription>
                <FormControls>
                    <BrandButton onClick={submit}>Submit</BrandButton>
                </FormControls>
            </Form>
        </Container>
    )
})
