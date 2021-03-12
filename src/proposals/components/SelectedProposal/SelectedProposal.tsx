/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled, { keyframes } from "styled-components"

import { useStores } from "../../../store"
import { ConnectDisconnectButton } from "../../../connection/components/ConnectDisconnectButton/ConnectDisconnectButton"
import { Flag } from "../../../location/components/Flag/Flag"
import { ProposalQuality } from "../ProposalQuality/ProposalQuality"
import { perGiB, perHour } from "../../../payment/rate"

const slideIn = keyframes`
    from {
        transform: translateY(100%);
    }
    to {
        transform: none;
    }
`

const Container = styled.div`
    box-sizing: border-box;
    height: 72px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    border-left: 1px solid #e6e6e6;
    box-shadow: inset 0 1px 1px #e6e6e6;
    animation: ${slideIn} 150ms ease-in-out;
`

const ProposalFlag = styled(Flag)`
    padding-right: 16px;
`

const ProviderId = styled.p`
    user-select: text;
    font-weight: bold;
`

const ServiceInfo = styled.div`
    p {
        margin: 0;
        margin-right: 16px;
        line-height: 20px;
    }
`

const ConnectWrapper = styled.div`
    margin-left: auto;
`
export const SelectedProposal: React.FC = observer(() => {
    const { proposals } = useStores()
    const proposal = proposals.active
    if (!proposal) {
        return <></>
    }
    const timeRate = perHour(proposal.paymentMethod)
    const trafficRate = perGiB(proposal.paymentMethod)
    const pricingText = `${timeRate}/h ${trafficRate}/GiB`

    return (
        <Container>
            <ProposalFlag countryCode={proposal.country} />
            <ServiceInfo>
                <ProviderId>{proposal.shortId}</ProviderId>
                <p>{pricingText}</p>
            </ServiceInfo>
            <ProposalQuality level={proposal.qualityLevel} />
            <ConnectWrapper>
                <ConnectDisconnectButton />
            </ConnectWrapper>
        </Container>
    )
})
