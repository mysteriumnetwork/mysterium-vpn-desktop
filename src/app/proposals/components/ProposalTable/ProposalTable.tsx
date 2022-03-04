/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useRef } from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { CellProps, Column, Renderer, SortByFn, useBlockLayout, useSortBy, useTable } from "react-table"
import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { Quality } from "mysterium-vpn-js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRegistered } from "@fortawesome/free-solid-svg-icons"

import { useStores } from "../../../store"
import { UIProposal } from "../../uiProposal"
import { ProposalQuality } from "../ProposalQuality/ProposalQuality"
import { brand, darkBlue, lightBlue } from "../../../ui-kit/colors"
import { perGiB, perHour } from "../../../payment/rate"
import { IconPriceTier } from "../../../ui-kit/icons/IconPriceTier"
import { countryName } from "../../../location/countries"
import { Toggle } from "../../../ui-kit/components/Toggle/Toggle"

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
    }

    .td,
    .th {
        height: 25px;
        line-height: 25px;
        white-space: nowrap;
        overflow: hidden;

        &.sorted-asc {
            box-shadow: inset 1px -4px 0px -2px ${brand};
        }
        &.sorted-desc {
            box-shadow: inset 1px 4px 0px -2px ${brand};
        }
    }
    .th {
        color: #5a597d;
        opacity: 0.5;
        &:last-child {
            padding: 0;
        }
    }

    .thead {
        .tr {
            box-sizing: border-box;
            padding-left: 12px;
            font-size: 11px;
            border-bottom: 1px dashed #dfdff3;
        }
    }
    .tbody {
        flex: 1;
    }
`

const TableRow = styled.div`
    border-bottom: 1px dashed #dfdff3;
`

const TableToggle = styled(Toggle).attrs({
    activeColor: "#5a597d",
    hoverColor: lightBlue,
    textColor: darkBlue,
    paddingX: "6px",
})``

const CellCenter = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

type TableProps = {
    columns: Column<UIProposal>[]
    data: UIProposal[]
}

const Table: React.FC<TableProps> = observer(({ columns, data }) => {
    const { proposals, filters } = useStores()
    const defaultColumn = React.useMemo(
        () => ({
            width: 50,
        }),
        [],
    )
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setHiddenColumns } = useTable<UIProposal>(
        {
            columns,
            data,
            defaultColumn,
            autoResetSortBy: false,
            initialState: {
                sortBy: [{ id: "country" }, { id: "quality", desc: true }],
                hiddenColumns: ["priceHour", "priceGib"],
            },
        },
        useBlockLayout,
        useSortBy,
    )
    useEffect(() => {
        if (filters.country == null) {
            setHiddenColumns(["priceHour", "priceGib"])
        } else {
            setHiddenColumns(["country"])
        }
    }, [filters.country])
    const listRef = useRef<FixedSizeList>(null)
    useEffect(() => {
        if (proposals.suggestion) {
            const idx = rows.findIndex((row) => row.original.providerId === proposals.suggestion?.providerId)
            if (idx != -1) {
                listRef.current?.scrollToItem(idx, "center")
            }
        }
    }, [proposals.suggestion])
    const activeKey = proposals.active?.key
    const renderRow = React.useCallback(
        ({ index, style }): JSX.Element => {
            const row = rows[index]
            prepareRow(row)
            const active = activeKey == row.original.key
            const onClick = (): void => proposals.toggleActiveProposal(row.original)
            const rowMarginX = 6
            return (
                <div
                    style={{
                        ...style,
                        boxSizing: "border-box",
                        width: `calc(100% - ${rowMarginX * 2}px)`,
                        left: rowMarginX,
                    }}
                >
                    <TableRow>
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
                    </TableRow>
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
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps({
                                            title: column.canSort ? `Sort by ${column.Header}` : undefined,
                                        }),
                                    )}
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
                        <FixedSizeList
                            itemCount={data.length}
                            itemSize={30}
                            width={width}
                            height={height}
                            ref={listRef}
                        >
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
            const q1 = rowA.original.quality?.quality ?? -1
            const q2 = rowB.original.quality?.quality ?? -1
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
                Header: "",
                accessor: "ipType",
                width: 25,
                Cell: (props) => {
                    if (props.value === "residential") {
                        return (
                            <span style={{ fontSize: 15 }}>
                                <FontAwesomeIcon icon={faRegistered} />
                            </span>
                        )
                    }
                    return ""
                },
                disableSortBy: true,
            },
            { Header: "Node", accessor: "shortId", width: 120 },

            {
                Header: "Country",
                accessor: "country",
                width: 124,
                // eslint-disable-next-line react/display-name
                Cell: (props): Renderer<CellProps<UIProposal, string>> => <span>{countryName(props.value)}</span>,
            },
            {
                Header: "Price/h",
                id: "priceHour",
                accessor: (p): string => perHour(p.price),
                width: 62,
                sortType: "basic",
            },
            {
                Header: "Price/GiB",
                id: "priceGib",
                accessor: (p): string => perGiB(p.price),
                width: 62,
                sortType: "basic",
            },
            {
                Header: "Price",
                accessor: (p): number => proposals.priceTier(p),
                width: 44,
                // eslint-disable-next-line react/display-name
                Cell: (props: { value: number }): Renderer<CellProps<UIProposal, string>> => (
                    <IconPriceTier tier={props.value} />
                ),
            },
            {
                Header: "Quality",
                accessor: "quality",
                width: 42,
                sortDescFirst: true,
                sortType: qualitySortFn,
                // eslint-disable-next-line react/display-name
                Cell: (props): Renderer<CellProps<UIProposal, Quality | undefined>> => {
                    return (
                        <CellCenter>
                            <ProposalQuality level={props.value?.quality} />
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
