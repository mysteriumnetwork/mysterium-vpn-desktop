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
import { ConnectButton } from "../../../connection/components/ConnectButton/ConnectButton"
import { Flag } from "../../../location/components/Flag/Flag"
import { displayTokens4 } from "../../../payment/display"

const slideIn = keyframes`
    from {
        transform: translateY(100%);
    }
    to {
        transform: none;
    }
`
const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

const Container = styled.div`
    box-sizing: border-box;
    height: 60px;
    padding: 0 15px;
    width: 100%;

    box-shadow: 0px 0px 20px rgba(109, 60, 121, 0.3);
    border-radius: 10px;
    animation: ${slideIn} 150ms ease-in-out;
`

const Inner = styled.div`
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: space-between;
    opacity: 1;
    animation: ${fadeIn} 250ms ease-in-out;
`

const ProposalFlag = styled(Flag)`
    padding-right: 7px;
`

const ProviderId = styled.div`
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
export const SelectedProposal: React.FC = observer(function SelectedProposal() {
    const { proposals } = useStores()
    const proposal = proposals.active
    if (!proposal) {
        return <></>
    }
    const timeRate = displayTokens4(proposal.price.perHourTokens)
    const trafficRate = displayTokens4(proposal.price.perGibTokens)
    const pricingText = `${timeRate}/h ${trafficRate}/GiB`

    return (
        <Container>
            <Inner>
                <ProposalFlag countryCode={proposal.country} />
                <ProviderId>{proposal.shortId}</ProviderId>
                <Pricing>{pricingText}</Pricing>
                <ConnectWrapper>
                    <ConnectButton />
                </ConnectWrapper>
            </Inner>
        </Container>
    )
})
