/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import styled from "styled-components"

import { Prompt } from "../../../ui-kit/components/Prompt/Prompt"
import { Small } from "../../../ui-kit/typography"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { darkBlue, greyBlue1 } from "../../../ui-kit/colors"

const PromptExplanation = styled(Small)`
    opacity: 0.7;
    margin-bottom: 15px;
`
const PromptInput = styled(TextInput)`
    border: 1px solid ${greyBlue1};
    color: ${darkBlue};
    ::placeholder {
        opacity: 0.7;
        color: ${darkBlue};
    }
    margin-bottom: 0;
`

const PromptValidation = styled(Small)`
    margin: 5px 0 10px;
    color: red;
    height: 15px;
`

export interface ExportIdentityPromptProps {
    visible: boolean
    onSubmit: SubmitHandler<ExportIdentityFormFields>
    onCancel: () => void
}

export interface ExportIdentityFormFields {
    passphrase: string
    confirmPassphrase: string
}

export const ExportIdentityPrompt: React.FC<ExportIdentityPromptProps> = ({ visible, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<ExportIdentityFormFields>()
    useEffect(() => {
        if (!visible) {
            reset()
        }
    }, [visible])
    return (
        <Prompt title="Choose a passphrase" visible={visible} onSubmit={handleSubmit(onSubmit)} onCancel={onCancel}>
            <PromptExplanation>Used to encrypt the exported file. Min. length: 12</PromptExplanation>
            <PromptInput
                autoFocus
                placeholder="Passphrase"
                type="password"
                {...register("passphrase", {
                    required: "This is required",
                    minLength: {
                        value: 12,
                        message: "Should be at least 12 characters",
                    },
                })}
            />
            <PromptValidation>{errors.passphrase?.message}</PromptValidation>
            <PromptInput
                placeholder="Confirm passphrase"
                type="password"
                {...register("confirmPassphrase", {
                    required: "This is required",
                    minLength: {
                        value: 12,
                        message: "Should be at least 12 characters",
                    },
                    deps: ["passphrase"],
                    validate: {
                        matchesPassphrase: (value) => {
                            const { passphrase } = getValues()
                            return value === passphrase || "Passphrases do not match!"
                        },
                    },
                })}
            />
            <PromptValidation>{errors.confirmPassphrase?.message}</PromptValidation>
        </Prompt>
    )
}
