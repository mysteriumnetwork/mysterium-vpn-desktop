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
    height: 60px;
    padding: 17px;
    padding-left: 24px;
    display: flex;
    align-items: center;
    box-shadow: 0px 0px 20px rgba(109, 60, 121, 0.3);
    border-radius: 10px;
    animation: ${slideIn} 150ms ease-in-out;
`

const ProposalFlag = styled(Flag)`
    padding-right: 7px;
`

const ProviderId = styled.p`
    user-select: text;
    font-weight: bold;
    padding-right: 7px;
`

const Pricing = styled.div`
    font-size: 11px;
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
    const timeRate = perHour(proposal.price)
    const trafficRate = perGiB(proposal.price)
    const pricingText = `${timeRate}/h ${trafficRate}/GiB`

    return (
        <Container>
            <ProposalFlag countryCode={proposal.country} />
            <ProviderId>{proposal.shortId}</ProviderId>
            <Pricing>{pricingText}</Pricing>
            <ConnectWrapper>
                <ConnectDisconnectButton />
            </ConnectWrapper>
        </Container>
    )
})
