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
import toast from "react-hot-toast"

import { Heading2, Small } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { useStores } from "../../../store"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"
import { TextInput } from "../../../ui-kit/form-components/TextInput"

import { ExportIdentityFormFields, ExportIdentityPrompt } from "./ExportIdentityPrompt"
import { ImportIdentityFormFields, ImportIdentityPrompt } from "./ImportIdentityPrompt"

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

export const SettingsMysteriumId: React.FC = observer(function SettingsMysteriumId() {
    const { payment, identity } = useStores()

    // Export
    const [exportPrompt, setExportPrompt] = useState(false)
    const handleExportInitiate = () => {
        setExportPrompt(true)
    }

    const handleExportSubmit = ({ passphrase }: ExportIdentityFormFields) => {
        setExportPrompt(false)
        const res = identity.exportIdentity({ id: identity.identity?.id ?? "", passphrase })
        toast.promise(res, {
            loading: "Creating backup...",
            success: function successToast(filename) {
                return (
                    <span>
                        <b>Identity backed up!</b>
                        <br />
                        {filename}
                    </span>
                )
            },
            error: function errorToast(reason) {
                return (
                    <span>
                        <b>Identity backup failed 😶</b>
                        <br />
                        Error: {reason}
                    </span>
                )
            },
        })
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
    const handleImportSubmit = async ({ passphrase }: ImportIdentityFormFields) => {
        setImportPrompt(false)
        const res = identity.importIdentity({ filename: importFilename, passphrase })
        toast.promise(res, {
            loading: "Importing identity...",
            success: function successToast() {
                return (
                    <span>
                        <b>Mysterium ID imported!</b>
                    </span>
                )
            },
            error: function errorToast(reason) {
                return (
                    <span>
                        <b>Mysterium ID import failed 😶</b>
                        <br />
                        Error: {reason}
                    </span>
                )
            },
        })
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
