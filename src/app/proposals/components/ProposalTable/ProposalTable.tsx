/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { CSSProperties, useEffect, useRef } from "react"
import styled from "styled-components"
import { observer } from "mobx-react-lite"
import { Column, useBlockLayout, useSortBy, useTable } from "react-table"
import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRegistered } from "@fortawesome/free-solid-svg-icons"

import { useStores } from "../../../store"
import { UIProposal } from "../../uiProposal"
import { ProposalQuality } from "../ProposalQuality/ProposalQuality"
import { brand } from "../../../ui-kit/colors"
import { IconPriceTier } from "../../../ui-kit/icons/IconPriceTier"
import { displayTokens4 } from "../../../payment/display"

import { RowRenderer } from "./RowRenderer"

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

const hiddenColsSingleCountry = ["countryName"]
const hiddenColsAllCountries = ["priceHour", "priceGib"]

const Table: React.FC<TableProps> = observer(function Table({ columns, data }) {
    const { proposals, filters } = useStores()
    const defaultColumn = React.useMemo(
        () => ({
            width: 50,
        }),
        [],
    )
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setHiddenColumns, state } =
        useTable<UIProposal>(
            {
                columns,
                data,
                defaultColumn,
                autoResetSortBy: false,
                initialState: {
                    sortBy: [{ id: "countryName" }, { id: "qualityLevel", desc: true }],
                    hiddenColumns: filters.country == null ? hiddenColsAllCountries : hiddenColsSingleCountry,
                },
            },
            useBlockLayout,
            useSortBy,
        )
    useEffect(() => {
        if (filters.country == null) {
            if (state.hiddenColumns != hiddenColsAllCountries) {
                setHiddenColumns(hiddenColsAllCountries)
            }
        } else {
            if (state.hiddenColumns != hiddenColsSingleCountry) {
                setHiddenColumns(hiddenColsSingleCountry)
            }
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
    }, [proposals.suggestion, data])
    const renderRow = React.useCallback(
        ({ index, style }: { index: number; style: CSSProperties }): JSX.Element => {
            return <RowRenderer prepareRow={prepareRow} rows={rows} index={index} style={style} />
        },
        [prepareRow, rows],
    )
    return (
        <div className="table" {...getTableProps()}>
            <div className="thead">
                {headerGroups.map((headerGroup) => {
                    const { style, key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                    return (
                        <div key={key} className="tr" style={{ ...style, width: "100%" }} {...restHeaderGroupProps}>
                            {headerGroup.headers.map((column) => {
                                const { key, ...restHeaderProps } = column.getHeaderProps(
                                    column.getSortByToggleProps({
                                        title: column.canSort ? `Sort by ${column.Header}` : undefined,
                                    }),
                                )
                                return (
                                    <div
                                        key={key}
                                        className={`th ${
                                            column.isSorted ? (column.isSortedDesc ? "sorted-desc" : "sorted-asc") : ""
                                        }`}
                                        {...restHeaderProps}
                                    >
                                        {column.render("Header")}
                                    </div>
                                )
                            })}
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

export const ProposalTable: React.FC = observer(function ProposalTable() {
    const { proposals } = useStores()
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
                    return <span />
                },
                disableSortBy: true,
            },
            { Header: "Node", accessor: "shortId", width: 120 },

            {
                Header: "Country",
                accessor: "countryName",
                width: 124,
            },
            {
                Header: "Price/h",
                id: "priceHour",
                accessor: (p): string => displayTokens4(p.price.perHourTokens),
                width: 62,
                sortType: "basic",
            },
            {
                Header: "Price/GiB",
                id: "priceGib",
                accessor: (p): string => displayTokens4(p.price.perGibTokens),
                width: 62,
                sortType: "basic",
            },
            {
                Header: "Price",
                accessor: (p): number => proposals.priceTier(p),
                width: 44,
                Cell: (props: { value: number }) => <IconPriceTier tier={props.value} />,
            },
            {
                Header: "Quality",
                accessor: "qualityLevel",
                width: 42,
                sortDescFirst: true,
                Cell: (props) => {
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
            <Table columns={columns} data={proposals.filteredProposals} />
        </Styles>
    )
})
