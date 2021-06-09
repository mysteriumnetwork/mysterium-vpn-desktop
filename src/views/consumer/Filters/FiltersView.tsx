/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import { observer } from "mobx-react-lite"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEthernet, faMoneyBill, faSignal } from "@fortawesome/free-solid-svg-icons"

import { PriceFilter } from "../../../proposals/components/PriceFilter/PriceFilter"
import { QualityFilter } from "../../../proposals/components/QualityFilter/QualityFilter"
import { IpTypeFilter } from "../../../proposals/components/IpTypeFilter/IpTypeFilter"
import { SectionTitle } from "../../../ui-kit/components/SectionTitle/SectionTitle"
import { ResetFilters } from "../../../proposals/components/ResetFilters/ResetFilters"

const Container = styled.div`
    flex: 0;
    display: flex;
    flex-direction: column;
    padding: 16px;
    padding-top: 24px;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

const Col = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 12px;
    &:not(:last-child) {
        border-right: 1px solid #e6e6e6;
    }
`

const FilterTitle = styled(SectionTitle)`
    flex-direction: column;
    margin-bottom: 20px;
`

const Icon = styled(FontAwesomeIcon)`
    padding: 8px;
`

export const FiltersView: React.FC = observer(() => {
    return (
        <Container>
            <Row>
                <Col>
                    <FilterTitle>
                        <Icon icon={faMoneyBill} size="3x" />
                        Price limit
                    </FilterTitle>
                    <PriceFilter />
                </Col>
                <Col>
                    <FilterTitle>
                        <Icon icon={faSignal} size="3x" />
                        Quality
                    </FilterTitle>
                    <QualityFilter />
                </Col>
                <Col>
                    <FilterTitle>
                        <Icon icon={faEthernet} size="3x" />
                        IP type
                    </FilterTitle>
                    <IpTypeFilter />
                </Col>
            </Row>
            <Row>
                <ResetFilters />
            </Row>
        </Container>
    )
})
