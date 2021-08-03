/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { Currency, DECIMAL_PART, EntertainmentEstimateResponse } from "mysterium-vpn-js"
import { Redirect, Route, Switch } from "react-router-dom"

import { useStores } from "../../../store"
import { Heading2, Paragraph, Small } from "../../../ui-kit/typography"
import { displayUSD, fmtMoney } from "../../../payment/display"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { brandLight, greyBlue2 } from "../../../ui-kit/colors"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { locations } from "../../../navigation/locations"
import { IconMusic } from "../../../ui-kit/icons/IconMusic"
import { IconDocument } from "../../../ui-kit/icons/IconDocument"
import { IconPlay } from "../../../ui-kit/icons/IconPlay"
import { IconCloudDownload } from "../../../ui-kit/icons/IconCloudDownload"

import { WalletIdentity } from "./WalletIdentity"

const SideTop = styled.div`
    height: 156px;
    padding: 20px;
    overflow: hidden;

    text-align: center;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    height: 330px;
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
`

const Balance = styled(Heading2)`
    margin-top: 15px;
`

const BalanceCurrency = styled(Paragraph)`
    color: ${brandLight};
`

const BalanceFiatEquivalent = styled.div`
    margin-top: 16px;
    font-size: 11px;
`

const Content = styled(ViewContent)`
    background: none;
`

const EntertainmentBlocks = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
`

const EntertainmentBlock = styled.div`
    width: 87px;
    height: 100px;
    background: #f8f8fd;
    color: ${greyBlue2};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 10px;
`

const BlockIcon = styled.div`
    margin: 5px auto 5px;
    font-size: 20px;
    color: ${brandLight};
`
const EntertainmentExplanation = styled(Small)`
    margin: 5px auto;
    opacity: 0.7;
`

export const WalletView: React.FC = observer(() => {
    const { identity, payment, router } = useStores()
    const balance = identity.identity?.balance ?? 0
    const balanceDisplay = fmtMoney(
        {
            amount: balance,
            currency: Currency.MYSTTestToken,
        },
        {
            fractionDigits: 4,
            removeInsignificantZeros: false,
        },
    )
    const handleTopupClick = () => {
        router.push(locations.walletTopup)
    }
    const [estimates, setEstimates] = useState<EntertainmentEstimateResponse | undefined>(undefined)
    useEffect(() => {
        payment.estimateEntertainment(balance).then((res) => setEstimates(res))
    }, [balance])
    return (
        <ViewContainer>
            <ViewNavBar />

            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconWallet color={brandLight} />
                        <Balance>{balanceDisplay}</Balance>
                        <BalanceCurrency>{payment.appCurrency}</BalanceCurrency>
                        <BalanceFiatEquivalent>
                            {payment.appFiatCurrency} equivalent ≈{" "}
                            {displayUSD(payment.fiatEquivalent(balance / DECIMAL_PART))}
                        </BalanceFiatEquivalent>
                    </SideTop>
                    <SideBot>
                        {estimates && (
                            <>
                                <Paragraph style={{ textAlign: "center", marginBottom: 10 }}>
                                    Will be enough for:
                                </Paragraph>
                                <EntertainmentBlocks>
                                    <EntertainmentBlock>
                                        <BlockIcon>
                                            <IconPlay color={brandLight} />
                                        </BlockIcon>
                                        <Heading2>{estimates.videoMinutes}h</Heading2>
                                        <EntertainmentExplanation>
                                            Online <br />
                                            video
                                        </EntertainmentExplanation>
                                    </EntertainmentBlock>
                                    <EntertainmentBlock>
                                        <BlockIcon>
                                            <IconMusic color={brandLight} />
                                        </BlockIcon>
                                        <Heading2>{estimates.musicMinutes}h</Heading2>
                                        <EntertainmentExplanation>
                                            Online <br />
                                            music
                                        </EntertainmentExplanation>
                                    </EntertainmentBlock>
                                    <EntertainmentBlock>
                                        <BlockIcon>
                                            <IconCloudDownload color={brandLight} />
                                        </BlockIcon>
                                        <Heading2>{estimates.trafficMb}GiB</Heading2>
                                        <EntertainmentExplanation>of data download</EntertainmentExplanation>
                                    </EntertainmentBlock>
                                    <EntertainmentBlock>
                                        <BlockIcon>
                                            <IconDocument color={brandLight} />
                                        </BlockIcon>
                                        <Heading2>{estimates.browsingMinutes}h</Heading2>
                                        <EntertainmentExplanation>
                                            Web <br />
                                            browsing
                                        </EntertainmentExplanation>
                                    </EntertainmentBlock>
                                </EntertainmentBlocks>
                            </>
                        )}
                        <BrandButton style={{ marginTop: "auto" }} onClick={handleTopupClick}>
                            Top up
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <Switch>
                        <Route exact path={locations.walletIdentity.path}>
                            <WalletIdentity />
                        </Route>
                        <Redirect to={locations.walletIdentity.path} />
                    </Switch>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
