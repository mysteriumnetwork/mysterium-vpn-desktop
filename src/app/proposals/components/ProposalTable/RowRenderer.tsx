/**
 * Copyright (c) 2021 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ListChildComponentProps } from "react-window"
import { Row } from "react-table"
import { observer } from "mobx-react-lite"
import React from "react"
import styled from "styled-components"

import { useStores } from "../../../store"
import { UIProposal } from "../../uiProposal"
import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"
import { darkBlue, lightBlue } from "../../../ui-kit/colors"

const TableToggle = styled(Toggle).attrs({
    activeColor: "#5a597d",
    hoverColor: lightBlue,
    textColor: darkBlue,
    paddingX: "6px",
})``

export type RowRendererProps = {
    prepareRow: (row: Row<UIProposal>) => void
    rows: Array<Row<UIProposal>>
} & Omit<ListChildComponentProps, "data">

export const RowRenderer: React.FC<RowRendererProps> = observer(({ index, rows, style, prepareRow }) => {
    const { proposals } = useStores()
    const row = rows[index]
    prepareRow(row)
    const active = proposals.active?.key == row.original.key
    const onClick = (): void => proposals.toggleActiveProposal(row.original)
    const rowMarginX = 6
    return (
        <div
            key={row.original.key}
            style={{
                ...style,
                boxSizing: "border-box",
                width: `calc(100% - ${rowMarginX * 2}px)`,
                borderBottom: "1px dashed #dfdff3",
                left: rowMarginX,
            }}
        >
            <TableToggle active={active} onClick={onClick}>
                <div className="tr" {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                        const { key, ...rest } = cell.getCellProps()
                        return (
                            <div key={key} className="td" {...rest}>
                                {cell.render("Cell")}
                            </div>
                        )
                    })}
                </div>
            </TableToggle>
        </div>
    )
})
