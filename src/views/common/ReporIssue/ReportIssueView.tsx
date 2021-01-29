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
import { useToasts } from "react-toast-notifications"

import { textHuge, textSmall } from "../../../ui-kit/typography"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { TextArea } from "../../../ui-kit/form-components/TextArea"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { useStores } from "../../../store"
import { log } from "../../../log/log"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    const { feedback, router } = useStores()
    const { addToast } = useToasts()
    const email = useRef<HTMLInputElement>(null)
    const description = useRef<HTMLTextAreaElement>(null)
    const clearInputs = () => {
        if (email.current) {
            email.current.value = ""
        }
        if (description.current) {
            description.current.value = ""
        }
    }
    const submit = async () => {
        try {
            const issueId = await feedback.reportIssue({
                email: email.current?.value,
                description: description.current?.value ?? "",
            })
            addToast(`Thanks for the feedback! Issue reference #${issueId}`, { appearance: "success" })
            router.history?.goBack()
            clearInputs()
        } catch (err) {
            addToast("Could not submit the report.\nPlease try again later.", {
                appearance: "error",
                autoDismiss: true,
            })
            log.error("Could not submit the report", err.message)
        }
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
                    <BrandButton onClick={submit} loading={feedback.loading}>
                        Submit
                    </BrandButton>
                </FormControls>
            </Form>
        </Container>
    )
})
