/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useRef } from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBug } from "@fortawesome/free-solid-svg-icons"
import toast from "react-hot-toast"

import { Heading2, Small } from "../../../ui-kit/typography"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { TextArea } from "../../../ui-kit/form-components/TextArea"
import { useStores } from "../../../store"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"

const Title = styled(Heading2)`
    margin: 15px 0;
`

const Explanation = styled(Small)`
    opacity: 0.5;
    margin-bottom: 15px;
`

const DescriptionTextArea = styled(TextArea)`
    height: 140px;
    resize: none;
`

const SendButton = styled(LightButton)`
    margin-top: auto;
    width: 120px;
`

export const HelpContentReportIssue: React.FC = observer(function HelpContentReportIssue() {
    const { feedback } = useStores()
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
        const res = feedback.reportIssue({
            email: email.current?.value,
            description: description.current?.value ?? "",
        })
        await toast.promise(res, {
            loading: "Sending report...",
            success: function successToast(issueId) {
                return (
                    <span>
                        <b>Report #{issueId} submitted</b>
                        <br />
                        Thanks for the feedback!
                    </span>
                )
            },
            error: function errorToast(reason) {
                return (
                    <span>
                        <b>Could not submit the report 😶</b>
                        <br />
                        {reason}
                    </span>
                )
            },
        })
        clearInputs()
    }
    return (
        <>
            <FontAwesomeIcon icon={faBug} color="#ffffff88" size="2x" />
            <Title>Bug report</Title>
            <Explanation>
                Describe the problem you got while using the application. We will try to solve it. Also leave your email
                so that we can contact you if needed.
            </Explanation>
            <TextInput placeholder="Email (optional)" ref={email} />
            <DescriptionTextArea placeholder="Describe the issue" ref={description} />
            <Explanation>
                Description and <strong>application logs</strong> will be attached to the issue. Logs may include
                sensitive information, such as IP address and location. It will be only accessible and used by the dev
                team to address the issue you are having.
            </Explanation>
            <SendButton onClick={submit} loading={feedback.loading}>
                Send
            </SendButton>
        </>
    )
})
