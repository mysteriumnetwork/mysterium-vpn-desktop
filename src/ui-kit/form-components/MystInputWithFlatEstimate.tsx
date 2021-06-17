/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"

import { displayUSD } from "../../payment/display"
import { mystToUSD } from "../../payment/rate"

import { TextInput } from "./TextInput"
import { NumberInput, NumberInputProps } from "./NumberInput"

const Container = styled.div`
    width: 280px;
    display: flex;
    flex-direction: row;
`

const MystInput = styled(NumberInput)`
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid #c4c4c4;
    padding: 0 4px 0 12px;
` as React.FC<NumberInputProps>

const Suffix = styled.div`
    position: relative;
    display: inline-block;
    width: 0;
    right: 56px;
    line-height: 30px;
`

const FlatEstimate = styled(TextInput).attrs(() => ({
    disabled: true,
}))`
    border: 1px solid #c4c4c4;
    border-left: 1px solid transparent;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding: 0 4px 0 12px;
`

export interface MoneyInputProps {
    value?: number
    defaultValue?: number
    rate?: number
    suffix?: string
    onChange?: (val?: number) => void
    disabled?: boolean
}

export const ControlledMystInputWithFlatEstimate: React.FC<MoneyInputProps> = ({
    value,
    defaultValue,
    rate,
    suffix,
    disabled = false,
}) => {
    const usd = displayUSD(mystToUSD(value ?? 0, rate) ?? 0)
    return (
        <Container>
            <div style={{ flex: 2 }}>
                <MystInput defaultValue={defaultValue} value={value ?? 0} disabled={disabled} length={14} />
                <Suffix>{suffix ?? ""}</Suffix>
            </div>
            <div style={{ flex: 1 }}>
                <FlatEstimate value={usd} />
            </div>
        </Container>
    )
}

export const UncontrolledMystInputWithFlatEstimate: React.FC<MoneyInputProps> = observer(
    ({ suffix, defaultValue, rate, onChange, disabled = false }) => {
        const [val, setVal] = useState<number | undefined>(undefined)
        const usd = displayUSD(mystToUSD(val ?? 0, rate) ?? 0)
        return (
            <Container>
                <div style={{ flex: 2 }}>
                    <MystInput
                        defaultValue={defaultValue}
                        disabled={disabled}
                        length={14}
                        onChangeFn={(val) => {
                            setVal(val)
                            if (onChange) {
                                onChange(val)
                            }
                        }}
                    />
                    <Suffix>{suffix ?? ""}</Suffix>
                </div>
                <div style={{ flex: 1 }}>
                    <FlatEstimate value={usd} />
                </div>
            </Container>
        )
    },
)
