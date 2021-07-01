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
import { faGlobe } from "@fortawesome/free-solid-svg-icons"

import { Heading2, Small } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { useStores } from "../../../store"
import { userEvent } from "../../../analytics/analytics"
import { OtherAction } from "../../../analytics/actions"
import { Select } from "../../../ui-kit/form-components/Select"

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

export const SettingsConnection: React.FC = observer(() => {
    const { config } = useStores()
    const onDnsOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const val = event.target.value
        userEvent(OtherAction.SetDnsOption, val)
        config.setDnsOption(val)
    }
    return (
        <>
            <Section>
                <SectionIcon icon={faGlobe} color="#ffffff88" size="2x" />
                <Title>DNS server</Title>
                <Explanation>
                    Domain Name System (DNS) is used to resolve internet addresses. You will need to re-connect for the
                    change to apply.
                </Explanation>
                <Select id="dns" value={config.dnsOption} onChange={onDnsOptionChange}>
                    <option value="1.1.1.1">Cloudflare</option>
                    <option value="auto">Automatic</option>
                    <option value="provider">Provider</option>
                    <option value="system">System</option>
                </Select>
            </Section>
        </>
    )
})
