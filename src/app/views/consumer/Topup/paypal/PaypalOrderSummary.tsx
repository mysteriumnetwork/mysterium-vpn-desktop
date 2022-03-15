/**
 * Copyright (c) 2022 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { useStores } from "../../../../store"
import { BrandButton } from "../../../../ui-kit/components/Button/BrandButton"
import { ViewContainer } from "../../../../navigation/components/ViewContainer/ViewContainer"
import { ViewNavBar } from "../../../../navigation/components/ViewNavBar/ViewNavBar"
import { ViewSplit } from "../../../../navigation/components/ViewSplit/ViewSplit"
import { ViewSidebar } from "../../../../navigation/components/ViewSidebar/ViewSidebar"
import { ViewContent } from "../../../../navigation/components/ViewContent/ViewContent"
import { IconWallet } from "../../../../ui-kit/icons/IconWallet"
import { Heading2, Small } from "../../../../ui-kit/typography"
import { brandLight } from "../../../../ui-kit/colors"
import { StepProgressBar } from "../../../../ui-kit/components/StepProgressBar/StepProgressBar"
import { topupSteps } from "../../../../navigation/locations"
import { parseError } from "../../../../../shared/errors/parseError"
import { dismissibleToast } from "../../../../ui-kit/components/dismissibleToast"
import { OrderBreakdown } from "../common/OrderBreakdown"

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
`

const Title = styled(Heading2)`
    margin: 15px 0;
`

const TitleDescription = styled(Small)``

export const PaypalOrderSummary: React.FC = observer(() => {
    const { payment, connection } = useStores()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const handleNextClick = async () => {
        setLoading(() => true)
        try {
            await payment.openOrderSecureForm()
            setLoading(() => false)
            navigate("../" + topupSteps.paypalWaitingForPayment)
        } catch (err) {
            setLoading(() => false)
            const msg = parseError(err)
            toast.error(dismissibleToast(<span>{msg.humanReadable}</span>))
        }
    }
    useEffect(() => {
        if (payment.taxCountry) {
            return
        }
        const countryFromLocation = connection.originalLocation?.country
        payment.setTaxCountry(countryFromLocation)
    }, [])
    return (
        <ViewContainer>
            <ViewNavBar onBack={() => navigate(-1)}>
                <div style={{ width: 375, textAlign: "center" }}>
                    <StepProgressBar step={1} />
                </div>
            </ViewNavBar>
            <ViewSplit>
                <ViewSidebar>
                    <SideTop>
                        <IconWallet color={brandLight} />
                        <Title>Top up your account</Title>
                        <TitleDescription>Review your order summary.</TitleDescription>
                    </SideTop>
                    <SideBot>
                        <OrderBreakdown />
                        <BrandButton
                            style={{ marginTop: "auto" }}
                            onClick={handleNextClick}
                            loading={loading}
                            disabled={loading || !payment.taxCountry}
                        >
                            Continue to Pay
                        </BrandButton>
                    </SideBot>
                </ViewSidebar>
                <ViewContent />
            </ViewSplit>
        </ViewContainer>
    )
})
