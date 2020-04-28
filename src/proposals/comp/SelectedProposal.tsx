/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { displayMoney, pricePerGiB, pricePerMinute, QualityLevel } from "mysterium-vpn-js"
import { observer } from "mobx-react-lite"
import styled, { keyframes } from "styled-components"

import { useStores } from "../../store"
import { resolveCountry } from "../../location/countries"
import { ConnectDisconnectButton } from "../../connection/comp/connect-disconnect-button"

import { ProposalQuality } from "./ProposalQuality/ProposalQuality"

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

const Flag = styled.img`
    padding: 16px;
`

const ProviderId = styled.p`
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
    const country = resolveCountry(proposal.country)

    const timeRate = displayMoney(pricePerMinute(proposal.paymentMethod))
    const trafficRate = displayMoney(pricePerGiB(proposal.paymentMethod))
    const pricingText = `${timeRate}/min ${trafficRate}/GiB`

    return (
        <Container>
            <Flag src={country.flag} alt={country.name} />
            <ServiceInfo>
                <ProviderId>{proposal.id10}</ProviderId>
                <p>{pricingText}</p>
            </ServiceInfo>
            <ProposalQuality level={proposal.qualityLevel ?? QualityLevel.UNKNOWN} />
            <ConnectWrapper>
                <ConnectDisconnectButton />
            </ConnectWrapper>
        </Container>
    )
})
