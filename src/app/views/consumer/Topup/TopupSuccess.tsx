/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { faCheckCircle, faDownload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-hot-toast"
import { IdentityRegistrationStatus } from "mysterium-vpn-js"

import { useStores } from "../../../store"
import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { Heading2, Small } from "../../../ui-kit/typography"
import { brandLight } from "../../../ui-kit/colors"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
import { locations } from "../../../navigation/locations"
import { StepProgressBar } from "../../../ui-kit/components/StepProgressBar/StepProgressBar"

const SideTop = styled.div`
    box-sizing: border-box;
    height: 136px;
    padding: 20px 15px;
    overflow: hidden;
    text-align: center;
`

const SideBot = styled.div`
    background: #fff;
    box-shadow: 0px 0px 30px rgba(11, 0, 75, 0.1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    flex: 1 0 auto;

    display: flex;
    flex-direction: column;
    text-align: center;
`

const TitleIcon = styled.div`
    margin-bottom: 15px;
`
const Title = styled(Heading2)`
    margin-bottom: 15px;
`

const TitleDescription = styled(Small)``

const Content = styled(ViewContent)`
    padding: 20px 15px;
`

export const TopupSuccess: React.FC = observer(() => {
    const { payment, identity, navigation } = useStores()
    const isRegistrationTopup = identity.identity?.registrationStatus != IdentityRegistrationStatus.Registered
    const handleAction = () => {
        if (isRegistrationTopup) {
            identity.register(identity.requireId())
            navigation.push(locations.idRegistering)
        } else {
            navigation.goHome()
        }
    }
    useEffect(() => {
        toast.success(`${payment.appCurrency}s will be credited to your wallet within next 1-3 minutes.`)
    }, [])
    return (
        <ViewContainer>
            <ViewNavBar>
                <div style={{ width: 375, textAlign: "center" }}>
                    <StepProgressBar step={3} />
                </div>
            </ViewNavBar>
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <TitleIcon>
                            <IconWallet color={brandLight} />
                        </TitleIcon>
                        <Title>Payment successful!</Title>
                        <TitleDescription>
                            {payment.appCurrency}s will be credited to your wallet within next 1-3 minutes.
                        </TitleDescription>
                    </SideTop>
                    <SideBot>
                        <BrandButton style={{ marginTop: "auto" }} onClick={handleAction}>
                            Continue
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                        <Heading2>
                            <FontAwesomeIcon className="icon" icon={faCheckCircle} color="#ffffff44" size="10x" />
                            <div style={{ marginTop: 20, cursor: "pointer" }} onClick={() => payment.downloadInvoice()}>
                                <FontAwesomeIcon
                                    style={{ marginRight: 10 }}
                                    className="icon"
                                    icon={faDownload}
                                    color="#ffffff44"
                                    size="1x"
                                />
                                Download invoice
                            </div>
                        </Heading2>
                    </div>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
