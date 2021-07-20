/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExport, faIdBadge } from "@fortawesome/free-solid-svg-icons"

import { Heading2, Small } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { useStores } from "../../../store"
import { LightButton } from "../../../ui-kit/components/Button/LightButton"
import { TextInput } from "../../../ui-kit/form-components/TextInput"

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

export const SettingsAccount: React.FC = observer(() => {
    const { payment, identity } = useStores()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onBackupIdentity = () => {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onRestoreIdentity = () => {}
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
                    <LightButton style={{ marginRight: 20 }} onClick={() => onBackupIdentity()}>
                        Backup
                    </LightButton>
                    <LightButton onClick={() => onRestoreIdentity()}>Restore from backup</LightButton>
                </div>
            </Section>
        </>
    )
})
