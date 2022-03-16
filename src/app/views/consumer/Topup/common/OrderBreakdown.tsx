/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import ReactTooltip from "react-tooltip"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons"

import { useStores } from "../../../../store"
import { Paragraph } from "../../../../ui-kit/typography"
import { brandLight } from "../../../../ui-kit/colors"
import { countryName } from "../../../../location/countries"

const LineItem = styled(Paragraph)`
    border-bottom: 1px dashed #ddd;
    padding: 10px 0;
    text-align: left;
`

const LineItemAmount = styled.span`
    float: right;
    font-weight: bold;
`

const TooltipIcon = styled(FontAwesomeIcon).attrs({
    icon: faQuestionCircle,
})`
    margin-left: 10px;
`

const Tooltip = styled(ReactTooltip).attrs({
    effect: "solid",
})`
    width: 200px;
`

export const OrderBreakdown: React.FC = observer(() => {
    const { payment } = useStores()

    return (
        <>
            <LineItem>
                {payment.order?.receiveMyst} {payment.appCurrency}
                <LineItemAmount>
                    {payment.order?.itemsSubTotal} {payment.order?.currency}
                </LineItemAmount>
            </LineItem>
            {!!Number(payment.order?.taxSubTotal) && (
                <LineItem>
                    <Tooltip id="vat-tooltip">
                        <span>
                            {countryName(payment.order?.country)} - {payment.order?.taxRate}%
                        </span>
                    </Tooltip>
                    VAT
                    <TooltipIcon data-tip="" data-for="vat-tooltip" />
                    <LineItemAmount>
                        {payment.order?.taxSubTotal} {payment.order?.currency}
                    </LineItemAmount>
                </LineItem>
            )}
            <LineItem style={{ color: brandLight }}>
                Total
                <LineItemAmount>
                    {payment.order?.orderTotal} {payment.order?.currency}
                </LineItemAmount>
            </LineItem>
            {payment.order?.payCurrency !== payment.order?.currency && (
                <LineItem>
                    Pay by:
                    <LineItemAmount>
                        {payment.order?.payAmount} {payment.order?.payCurrency}
                    </LineItemAmount>
                </LineItem>
            )}
        </>
    )
})
