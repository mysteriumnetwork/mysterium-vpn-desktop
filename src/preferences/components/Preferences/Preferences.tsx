/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"

import { SectionTitle } from "../../../ui-kit/components/SectionTitle/SectionTitle"
import { textHuge } from "../../../ui-kit/typography"
import { useStores } from "../../../store"

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const Title = styled.div`
    padding-top: 12px;
    padding-bottom: 48px;
    ${textHuge};
    text-align: center;
`

const Content = styled.div`
    width: 300px;
    margin: 0 auto;
`

const FormSectionTitle = styled(SectionTitle)`
    margin-bottom: 16px;
`

const FormLabel = styled.label`
    display: inline-block;
    width: 100px;
`

export const Preferences: React.FC = observer(() => {
    const { config } = useStores()
    return (
        <Container>
            <Content>
                <Title>Preferences</Title>
                <FormSectionTitle>Connection</FormSectionTitle>
                <FormLabel htmlFor="dns">DNS</FormLabel>
                <select id="dns" value={config.dnsOption} onChange={(event) => config.setDnsOption(event.target.value)}>
                    <option value="1.1.1.1">Cloudflare (default)</option>
                    <option value="auto">Automatic</option>
                    <option value="provider">Provider</option>
                    <option value="system">System</option>
                </select>
            </Content>
        </Container>
    )
})
