/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { CellProps, Column, Renderer, SortByFn, useBlockLayout, useSortBy, useTable } from "react-table"
import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { displayMoney, pricePerGiB, pricePerMinute, QualityLevel } from "mysterium-vpn-js"

import { useStores } from "../../../store"
import { UIProposal } from "../../ui-proposal-type"
import { Flag } from "../../../location/components/Flag/Flag"
import { ProposalQuality } from "../ProposalQuality/ProposalQuality"
import { brand } from "../../../ui-kit/colors"

const Styles = styled.div`
    flex: 1;
    min-height: 0;
    display: flex;

    .table {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        user-select: none;
    }

    .td,
    .th {
        height: 32px;
        line-height: 32px;
        padding: 0 8px;

        &.sorted-asc {
            box-shadow: inset 1px -4px 0px -2px ${brand};
        }
        &.sorted-desc {
            box-shadow: inset 1px 4px 0px -2px ${brand};
        }
    }

    .thead {
        .tr {
            box-sizing: border-box;
            padding: 0 8px;
            font-size: 12px;
            box-shadow: inset 0 -1px 1px #e6e6e6;
        }
    }
    .tbody {
        flex: 1;

        .tr {
        }

        .tr:first-child {
            margin-top: 8px;
        }
        .tr:last-child {
            margin-bottom: 8px;
        }
    }
`

interface ToggleProps {
    children: React.ReactNode
    active: boolean
    onClick: () => void
}

const TableToggle = styled.div`
    cursor: pointer;
    border-radius: 4px;
    color: ${(props: ToggleProps): string => (props.active ? "#fff" : "#404040")};
    background: ${(props: ToggleProps): string =>
        props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "transparent"};
    &:hover {
        background: ${(props: ToggleProps): string =>
            props.active ? "linear-gradient(180deg, #873a72 0%, #673a72 100%)" : "#e6e6e6"};
    }
` as React.FC<ToggleProps>

const CellCenter = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`

type TableProps = {
    columns: Column<UIProposal>[]
    data: UIProposal[]
}

const Table: React.FC<TableProps> = observer(({ columns, data }) => {
    const { proposals } = useStores()
    const defaultColumn = React.useMemo(
        () => ({
            width: 50,
        }),
        [],
    )
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<UIProposal>(
        {
            columns,
            data,
            defaultColumn,
            autoResetSortBy: false,
            initialState: {
                sortBy: [{ id: "country" }],
            },
        },
        useBlockLayout,
        useSortBy,
    )
    const activeKey = proposals.active?.key
    const renderRow = React.useCallback(
        ({ index, style }): JSX.Element => {
            const row = rows[index]
            prepareRow(row)
            const active = activeKey == row.original.key
            const onClick = (): void => proposals.toggleActiveProposal(row.original)
            return (
                <div
                    style={{
                        ...style,
                        width: "calc(100% - 16px)",
                        left: 8,
                    }}
                >
                    <TableToggle key={row.original.key} active={active} onClick={onClick}>
                        <div className="tr" {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div className="td" {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </div>
                                )
                            })}
                        </div>
                    </TableToggle>
                </div>
            )
        },
        [prepareRow, rows, activeKey],
    )
    return (
        <div className="table" {...getTableProps()}>
            <div className="thead">
                {headerGroups.map((headerGroup) => {
                    const { style, ...rest } = headerGroup.getHeaderGroupProps()
                    return (
                        // eslint-disable-next-line react/jsx-key
                        <div className="tr" style={{ ...style, width: "100%" }} {...rest}>
                            {headerGroup.headers.map((column) => (
                                // eslint-disable-next-line react/jsx-key
                                <div
                                    className={`th ${
                                        column.isSorted ? (column.isSortedDesc ? "sorted-desc" : "sorted-asc") : ""
                                    }`}
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                >
                                    {column.render("Header")}
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
            <div className="tbody" {...getTableBodyProps()}>
                <AutoSizer>
                    {({ width, height }): JSX.Element => (
                        <FixedSizeList itemCount={data.length} itemSize={32} width={width} height={height}>
                            {renderRow}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            </div>
        </div>
    )
})

export const ProposalTable: React.FC = observer(() => {
    const { proposals } = useStores()
    const items = proposals.filteredProposals

    const qualitySortFn = React.useMemo<SortByFn<UIProposal>>(
        () => (rowA, rowB) => {
            const q1 = rowA.original.qualityLevel ?? QualityLevel.UNKNOWN
            const q2 = rowB.original.qualityLevel ?? QualityLevel.UNKNOWN
            if (q1 == q2) {
                return 0
            }
            return q1 > q2 ? 1 : -1
        },
        [],
    )
    const columns = React.useMemo<Column<UIProposal>[]>(
        () => [
            {
                Header: "Country",
                accessor: "country",
                width: 60,
                // eslint-disable-next-line react/display-name
                Cell: (props): Renderer<CellProps<UIProposal, string>> => (
                    <CellCenter>
                        <Flag countryCode={props.value} />
                    </CellCenter>
                ),
            },
            { Header: "ID", accessor: "shortId", width: 132 },
            {
                Header: "Price/min",
                accessor: (p): string => displayMoney(pricePerMinute(p.paymentMethod)),
                width: 62,
                sortType: "basic",
            },
            {
                Header: "Price/GiB",
                accessor: (p): string => displayMoney(pricePerGiB(p.paymentMethod)),
                width: 62,
                sortType: "basic",
            },
            {
                Header: "Quality",
                accessor: "qualityLevel",
                width: 60,
                sortDescFirst: true,
                sortType: qualitySortFn,
                // eslint-disable-next-line react/display-name
                Cell: (props): Renderer<CellProps<UIProposal, QualityLevel | undefined>> => {
                    return (
                        <CellCenter>
                            <ProposalQuality level={props.value} />
                        </CellCenter>
                    )
                },
            },
        ],
        [],
    ) as Column<UIProposal>[]
    return (
        <Styles>
            <Table columns={columns} data={items} />
        </Styles>
    )
})
