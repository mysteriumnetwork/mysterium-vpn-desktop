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
import { useToasts } from "react-toast-notifications"

import { Heading2, Small } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { useStores } from "../../../store"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"
import { TextInput } from "../../../ui-kit/form-components/TextInput"

import { ExportIdentityPrompt } from "./ExportIdentityPrompt"
import { ImportIdentityPrompt } from "./ImportIdentityPrompt"

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

const ToastWrap = styled.span`
    word-wrap: break-word;
    overflow-wrap: anywhere;
`

export const SettingsMysteriumId: React.FC = observer(() => {
    const { payment, identity } = useStores()
    const { addToast } = useToasts()

    // Export
    const [exportPrompt, setExportPrompt] = useState(false)
    const handleExportInitiate = () => {
        setExportPrompt(true)
    }
    const handleExportSubmit = async ({ passphrase }: { passphrase: string }) => {
        setExportPrompt(false)
        const res = await identity.exportIdentity({ id: identity.identity?.id ?? "", passphrase })
        if (res.result) {
            addToast(<ToastWrap>Identity backed up to {res.result}</ToastWrap>, { appearance: "success" })
        } else if (res.error) {
            addToast(<ToastWrap>Identity backup failed. Error: {res.error}</ToastWrap>, {
                appearance: "error",
                autoDismiss: true,
            })
        }
    }
    const handleExportCancel = () => {
        setExportPrompt(false)
    }

    // Import
    const [importPrompt, setImportPrompt] = useState(false)
    const [importFilename, setImportFilename] = useState("")
    const handleImportInitiate = async () => {
        const filename = await identity.importIdentityChooseFile()
        if (!filename) {
            return
        }
        setImportFilename(filename)
        setImportPrompt(true)
    }
    const handleImportSubmit = async ({ passphrase }: { passphrase: string }) => {
        setImportPrompt(false)
        const res = await identity.importIdentity({ filename: importFilename, passphrase })
        if (res.result) {
            addToast(<ToastWrap>Identity restored.</ToastWrap>, { appearance: "success" })
        } else if (res.error) {
            addToast(<ToastWrap>Identity restoration failed. Error: {res.error}</ToastWrap>, {
                appearance: "error",
                autoDismiss: true,
            })
        }
    }
    const handleImportCancel = () => {
        setImportPrompt(false)
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
                    <LightButton style={{ marginRight: 20 }} onClick={handleExportInitiate}>
                        Backup
                    </LightButton>
                    <LightButton onClick={handleImportInitiate}>Restore from backup</LightButton>
                </div>
            </Section>
            <ExportIdentityPrompt visible={exportPrompt} onSubmit={handleExportSubmit} onCancel={handleExportCancel} />
            <ImportIdentityPrompt visible={importPrompt} onSubmit={handleImportSubmit} onCancel={handleImportCancel} />
        </>
    )
})
