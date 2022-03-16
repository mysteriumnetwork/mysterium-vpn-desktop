/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { toast } from "react-hot-toast"
import _ from "lodash"

import { Prompt } from "../../../ui-kit/components/Prompt/Prompt"
import { Paragraph, Small } from "../../../ui-kit/typography"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { brand, darkBlue, greyBlue1 } from "../../../ui-kit/colors"
import { useStores } from "../../../store"

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

const RewardPreview = styled.div`
    text-align: center;
    margin-bottom: 20px;
`

const RewardIcon = styled(FontAwesomeIcon)`
    margin-bottom: 10px;
`

const RewardAmount = styled(Paragraph)``

export interface UseReferralCodePromptProps {
    visible: boolean
    onSubmit: SubmitHandler<ReferralCodeFormFields>
    onCancel: () => void
}

export interface ReferralCodeFormFields {
    code: string
}

export const UseReferralCodePrompt: React.FC<UseReferralCodePromptProps> = ({ visible, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        reset,
        trigger,
        formState: { errors },
    } = useForm<ReferralCodeFormFields>({ reValidateMode: "onSubmit" })
    const { referral, payment } = useStores()
    useEffect(() => {
        if (!visible) {
            reset()
            referral.resetToken()
        }
    }, [visible])
    const handleValidate = async () => {
        await trigger()
    }
    return (
        <Prompt
            title="Enter a referral code"
            visible={visible}
            onSubmit={referral.token ? handleSubmit(onSubmit) : handleValidate}
            onCancel={onCancel}
            submitText={referral.token ? "Apply" : "OK"}
        >
            <PromptExplanation />
            <PromptInput
                autoFocus
                placeholder="Code"
                {...register("code", {
                    required: "This is required",
                    validate: {
                        valid: async (code) => {
                            if (referral.token && code === referral.token) {
                                // Do not revalidate and toast on 'Apply'
                                return true
                            }
                            const loadingToastID = toast.loading("Validating token...")
                            const valid = await referral.validateToken(code)
                            const dismissWait = valid ? 500 : 850
                            _.debounce(() => toast.dismiss(loadingToastID), dismissWait, { trailing: true })()
                            return valid || "This token is not valid"
                        },
                    },
                })}
            />
            <PromptValidation>{errors.code?.message}</PromptValidation>
            {!!referral.rewardAmount && (
                <RewardPreview>
                    <RewardIcon className="icon" icon={faCheckCircle} color={brand} size="2x" />
                    <RewardAmount>
                        You will be awarded {referral.rewardAmount} {payment.appCurrency}(s)
                    </RewardAmount>
                </RewardPreview>
            )}
        </Prompt>
    )
}
