/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
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

export interface ImportIdentityPromptProps {
    visible: boolean
    onSubmit: ({ passphrase }: { passphrase: string }) => void
    onCancel: () => void
}

export const ImportIdentityPrompt: React.FC<ImportIdentityPromptProps> = ({ visible, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()
    useEffect(() => {
        if (!visible) {
            reset()
        }
    }, [visible])
    return (
        <Prompt title="Enter identity passphrase" visible={visible} onOK={handleSubmit(onSubmit)} onCancel={onCancel}>
            <form>
                <PromptExplanation>Used to decrypt the selected file.</PromptExplanation>
                <PromptInput
                    placeholder="Passphrase"
                    type="password"
                    {...register("passphrase", {
                        required: "This is required",
                    })}
                />
                <PromptValidation>{errors.passphrase?.message}</PromptValidation>
            </form>
        </Prompt>
    )
}