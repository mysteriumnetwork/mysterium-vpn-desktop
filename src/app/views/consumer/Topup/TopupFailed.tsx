/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { faSadCry } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"

import { ViewContainer } from "../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../ui-kit/icons/IconWallet"
import { Heading2, Small } from "../../../ui-kit/typography"
import { brandLight } from "../../../ui-kit/colors"
import { BrandButton } from "../../../ui-kit/components/Button/BrandButton"
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

export const TopupFailed: React.FC = observer(() => {
    const navigate = useNavigate()
    const handleStartOver = () => {
        navigate(-3)
    }
    return (
        <ViewContainer>
            <ViewNavBar>
                <div style={{ width: 375, textAlign: "center" }}>
                    <StepProgressBar step={2} />
                </div>
            </ViewNavBar>
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <TitleIcon>
                            <IconWallet color={brandLight} />
                        </TitleIcon>
                        <Title>Payment failed</Title>
                        <TitleDescription>Order expired or there was another issue.</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <BrandButton style={{ marginTop: "auto" }} onClick={handleStartOver}>
                            Start over
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <Content>
                    <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                        <Heading2>
                            <FontAwesomeIcon className="icon" icon={faSadCry} color="#ffffff44" size="10x" />
                        </Heading2>
                    </div>
                </Content>
            </ViewSplit>
        </ViewContainer>
    )
})
