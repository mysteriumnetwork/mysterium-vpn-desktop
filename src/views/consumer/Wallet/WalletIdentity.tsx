/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observer } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"

import { Paragraph, Small } from "../../../ui-kit/typography"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconIdentity } from "../../../ui-kit/icons/IconIdentity"
import { brandLight } from "../../../ui-kit/colors"
import { TextInput } from "../../../ui-kit/form-components/TextInput"
import { useStores } from "../../../store"

const Content = styled(ViewContent)`
    padding: 20px 26px;
`

const SectionTitle = styled(Paragraph)`
    margin-top: 13px;
    height: 28px;
`
const Explanation = styled(Small)`
    opacity: 0.5;
    margin-bottom: 15px;
`

const SectionIconWrap = styled.div`
    margin-bottom: 15px;
`

export const WalletIdentity: React.FC = observer(() => {
    const { identity } = useStores()
    return (
        <Content>
            <SectionIconWrap>
                <IconIdentity color={brandLight} />
            </SectionIconWrap>
            <SectionTitle>Identity: {identity.identity?.registrationStatus}</SectionTitle>
            <Explanation>
                Identity is your Mysterium internal user ID. Never send ether or any kind of ERC20 tokens there.
            </Explanation>
            <TextInput disabled value={identity.identity?.id} />
        </Content>
    )
})
