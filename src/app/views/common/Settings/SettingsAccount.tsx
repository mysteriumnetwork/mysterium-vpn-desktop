/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExport, faIdBadge } from "@fortawesome/free-solid-svg-icons"
import { useForm } from "react-hook-form"
import { useToasts } from "react-toast-notifications"

import { Heading2, Small } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { useStores } from "../../../store"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { darkBlue, greyBlue1 } from "../../../ui-kit/colors"
import { Prompt } from "../../../ui-kit/components/Prompt/Prompt"

const Title = styled(Heading2)`
    margin-bottom: 15px;
`

const Section = styled(ViewContent)`
    padding: 20px;
    margin-bottom: 10px;
`

const SectionIcon = styled(FontAwesomeIcon)`
    margin-bottom: 15px;
`

const Explanation = styled(Small)`
    opacity: 0.5;
    margin-bottom: 15px;
`

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

const ToastWrap = styled.span`
    word-wrap: break-word;
    overflow-wrap: anywhere;
`

export const SettingsAccount: React.FC = observer(() => {
    const { payment, identity } = useStores()
    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm({ shouldUseNativeValidation: false })
    const { addToast } = useToasts()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onRestoreIdentity = () => {}
    const [prompt, setPrompt] = useState(false)
    const handleBackupClick = () => {
        setPrompt(true)
        reset()
    }
    const handlePassphraseSubmit = async ({ passphrase }: { passphrase: string }) => {
        setPrompt(false)
        reset()
        const res = await identity.exportIdentity({ id: identity.identity?.id ?? "", passphrase })
        if (res.result) {
            addToast(<ToastWrap>Identity exported to {res.result}</ToastWrap>, { appearance: "success" })
        } else if (res.error) {
            addToast(<ToastWrap>Identity export failed. Error: {res.error}</ToastWrap>, {
                appearance: "error",
                autoDismiss: true,
            })
        }
    }
    return (
        <>
            <Section>
                <SectionIcon icon={faIdBadge} color="#ffffff88" size="2x" />
                <Title>Identity ({identity.identity?.registrationStatus})</Title>
                <Explanation>
                    Identity is your Mysterium internal user ID. Never send ether or any kind of ERC20 tokens there.
                </Explanation>
                <TextInput disabled value={identity.identity?.id} />
            </Section>
            <Section>
                <SectionIcon icon={faFileExport} color="#ffffff88" size="2x" />
                <Title>Backup/Restore</Title>
                <Explanation>
                    We don&apos;t store any account data. Make sure to back up your private key to keep your{" "}
                    {payment.appCurrency}s safe.
                </Explanation>
                <div>
                    <LightButton style={{ marginRight: 20 }} onClick={handleBackupClick}>
                        Backup
                    </LightButton>
                    <LightButton onClick={onRestoreIdentity}>Restore from backup</LightButton>
                </div>
            </Section>
            <Prompt
                title="Choose a passphrase"
                visible={prompt}
                onOK={handleSubmit(handlePassphraseSubmit)}
                onCancel={() => setPrompt(false)}
            >
                <form onSubmit={handleSubmit(handlePassphraseSubmit)}>
                    <PromptExplanation>Used to encrypt the exported file. Min. length: 12</PromptExplanation>
                    <PromptInput
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
                            validate: {
                                matchesPassphrase: (value) => {
                                    const { passphrase } = getValues()
                                    return value === passphrase || "Passphrases do not match!"
                                },
                            },
                        })}
                    />
                    <PromptValidation>{errors.confirmPassphrase?.message}</PromptValidation>
                </form>
            </Prompt>
        </>
    )
})
