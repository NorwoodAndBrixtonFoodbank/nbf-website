"use client";

import Icon from "@/components/Icons/Icon";
import { Filter, PaginationType } from "@/components/Tables/Filters";
import TableFilterAndExtraColumnsBar from "@/components/Tables/TableFilterAndExtraColumnsBar";
import {
    faAnglesDown,
    faAnglesUp,
    faPenToSquare,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgress, NoSsr } from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import styled from "styled-components";
import { Primitive, SortOrder } from "react-data-table-component/dist/DataTable/types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { Database } from "@/databaseTypesFile";
import { Centerer } from "../Modal/ModalFormStyles";
import { GenericSchema } from "@supabase/supabase-js/dist/module/lib/types";

export type TableHeaders<Data> = readonly (readonly [keyof Data, string])[];

export interface Row<Data> {
    rowId: number;
    data: Data;
}

export type ColumnDisplayFunction<T> = (data: T) => React.ReactNode;
export type ColumnDisplayFunctions<Data> = {
    [headerKey in keyof Data]?: ColumnDisplayFunction<Data[headerKey]>;
};

export type ColumnStyles<Data> = {
    [headerKey in keyof Data]?: ColumnStyleOptions;
};

export type OnRowClickFunction<Data> = (
    row: Row<Data>,
    event: React.MouseEvent<Element, MouseEvent>
) => void;

export type ColumnStyleOptions = Omit<
    TableColumn<unknown>,
    "name" | "selector" | "sortable" | "sortFunction" | "cell"
>;

export interface SortOptions<Data, DBRow extends Record<string,any>> {
    key: keyof Data;
    sortMethodConfig: SortMethodConfig<DBRow>;
}

type SortMethodConfig<DBRow extends Record<string,any>> =
    | {
          paginationType: PaginationType.Server;
          method: (
              query: PostgrestFilterBuilder<Database["public"], DBRow, any>,
              sortDirection: SortOrder
          ) => PostgrestFilterBuilder<Database["public"], DBRow, any>;
      }
    | {
          paginationType: PaginationType.Client;
          method: (sortDirection: SortOrder) => void;
      };
export type SortState<Data, DBRow extends Record<string,any>> =
    | {
          sortEnabled: true;
          sortDirection: SortOrder;
          column: CustomColumn<Data, DBRow>;
      }
    | {
          sortEnabled: false;
      };

export type SortConfig<Data, DBRow extends Record<string,any>> =
    | {
          sortPossible: true;
          sortableColumns: SortOptions<Data, DBRow>[];
          setSortState: (sortState: SortState<Data, DBRow>) => void;
      }
    | { sortPossible: false };

export interface CustomColumn<Data, DBRow extends Record<string,any>> extends TableColumn<Row<Data>> {
    sortMethodConfig?: SortMethodConfig<DBRow>;
}

export type CheckboxConfig<Data> =
    | {
          displayed: true;
          selectedRowIds: string[];
          isAllCheckboxChecked: boolean;
          onCheckboxClicked: (row: Data) => void;
          onAllCheckboxClicked: (isAllCheckboxChecked: boolean) => void;
          isRowChecked: (data: Data) => boolean;
      }
    | {
          displayed: false;
      };

export type PaginationConfig =
    | {
          enablePagination: true;
          filteredCount: number;
          onPageChange: (newPage: number) => void;
          onPerPageChange: (perPage: number) => void;
          rowsPerPageOptions?: number[];
          defaultRowsPerPage?: number;
      }
    | {
          enablePagination: false;
      };

export type FilterConfig<Data, DBRow extends Record<string, any>> =
    | {
          primaryFiltersShown: false;
          additionalFiltersShown: false;
      }
    | {
          primaryFiltersShown: true;
          primaryFilters: Filter<Data, any, DBRow>[];
          setPrimaryFilters: (primaryFilters: Filter<Data, any, DBRow>[]) => void;
          additionalFiltersShown: false;
      }
    | {
          primaryFiltersShown: true;
          primaryFilters: Filter<Data,DBRow, any>[];
          setPrimaryFilters: (primaryFilters: Filter<Data, any,DBRow>[]) => void;
          additionalFiltersShown: true;
          additionalFilters: Filter<Data,DBRow,any>[];
          setAdditionalFilters: (additionalFilters: Filter<Data, any,DBRow>[]) => void;
      };

export type EditableConfig<Data> =
    | {
          editable: true;
          setDataPortion: (dataPortion: Data[]) => void;
          onEdit?: (data: number) => void;
          onDelete?: (data: number) => void;
          onSwapRows?: (row1: Data, row2: Data) => Promise<void>;
          isDeletable?: (row: Data) => boolean;
      }
    | { editable: false };

interface Props<Data, DBRow extends Record<string,any>> {
    dataPortion: Data[];
    headerKeysAndLabels: TableHeaders<Data>;
    isLoading?: boolean;
    checkboxConfig: CheckboxConfig<Data>;
    paginationConfig: PaginationConfig;
    sortConfig: SortConfig<Data, DBRow>;
    filterConfig: FilterConfig<Data, DBRow>;
    defaultShownHeaders?: readonly (keyof Data)[];
    toggleableHeaders?: readonly (keyof Data)[];
    columnDisplayFunctions?: ColumnDisplayFunctions<Data>;
    columnStyleOptions?: ColumnStyles<Data>;
    editableConfig: EditableConfig<Data>;
    onRowClick?: OnRowClickFunction<Data>;
    pointerOnHover?: boolean;
}

interface CellProps<Data> {
    row: Row<Data>;
    columnDisplayFunctions: ColumnDisplayFunctions<Data>;
    headerKey: keyof Data;
}

const CustomCell = <Data,>({
    row,
    columnDisplayFunctions,
    headerKey,
}: CellProps<Data>): React.ReactElement => {
    const element: unknown = (
        <>
            {columnDisplayFunctions[headerKey]
                ? columnDisplayFunctions[headerKey]!(row.data[headerKey])
                : row.data[headerKey]}
        </>
    );

    if (!React.isValidElement(element)) {
        throw new Error(
            `${element} is not a valid JSX element, add a column display function for ${String(
                headerKey
            )}`
        );
    }

    return element;
};

const StyledIconButton = styled(IconButton)`
    padding: 0.1rem;
    margin: 0.1rem;
`;

const defaultColumnStyleOptions = {
    grow: 1,
    minWidth: "2rem",
    maxWidth: "20rem",
} as const;

const Table = <Data, DBRow extends Record<string,any>={}>({
    dataPortion,
    headerKeysAndLabels,
    isLoading = false,
    defaultShownHeaders,
    toggleableHeaders = [],
    onRowClick,
    columnDisplayFunctions = {},
    columnStyleOptions = {},
    checkboxConfig,
    sortConfig,
    filterConfig,
    paginationConfig,
    editableConfig,
    pointerOnHover,
}: Props<Data, DBRow>): React.ReactElement => {
    const [shownHeaderKeys, setShownHeaderKeys] = useState(
        defaultShownHeaders ?? headerKeysAndLabels.map(([key]) => key)
    );

    const shownHeaders = headerKeysAndLabels.filter(([key]) => shownHeaderKeys.includes(key));

    const columns: CustomColumn<Data, DBRow>[] = shownHeaders.map(
        ([headerKey, headerName]): CustomColumn<Data, DBRow> => {
            const columnStyles = Object.assign(
                { ...defaultColumnStyleOptions },
                columnStyleOptions[headerKey] ?? {}
            );
            let sortMethodConfig;
            if (sortConfig.sortPossible) {
                sortMethodConfig = sortConfig.sortableColumns.find(
                    (column) => column.key === headerKey
                )?.sortMethodConfig;
            }
            const sortable = !!sortMethodConfig;

            return {
                name: <>{headerName}</>,
                selector: (row) => row.data[headerKey] as Primitive, // The type cast here is needed as the type of selector is (row) => Primitive, but as we are using a custom cell, we can have it be anything
                sortable: sortable,
                cell: (row) => (
                    <CustomCell
                        row={row}
                        columnDisplayFunctions={columnDisplayFunctions}
                        headerKey={headerKey}
                    />
                ),
                sortField: headerKey.toString(),
                sortMethodConfig: sortMethodConfig,
                ...columnStyles,
            };
        }
    );

    const handleSort = async (
        column: CustomColumn<Data,DBRow>,
        sortDirection: SortOrder
    ): Promise<void> => {
        if (sortConfig.sortPossible && Object.keys(column).length) {
            sortConfig.setSortState({
                sortEnabled: true,
                column: column,
                sortDirection: sortDirection,
            });
        }
    };

    const [isSwapping, setIsSwapping] = useState(false);

    if (editableConfig.editable) {
        const swapRows = (rowIndex1: number, upwards: boolean): void => {
            if (isSwapping) {
                return;
            }
            setIsSwapping(true);

            const rowIndex2 = rowIndex1 + (upwards ? -1 : 1);

            if (
                rowIndex1 < 0 ||
                rowIndex2 < 0 ||
                rowIndex1 >= dataPortion.length ||
                rowIndex2 >= dataPortion.length
            ) {
                setIsSwapping(false);
                return;
            }

            const clientSideRefresh = (): void => {
                // Update viewed table data once specific functions are done (without re-fetch)
                const newData = [...dataPortion];
                const temp = newData[rowIndex1];
                newData[rowIndex1] = newData[rowIndex2];
                newData[rowIndex2] = temp;

                editableConfig.setDataPortion(newData);
                setIsSwapping(false);
            };

            if (editableConfig.onSwapRows) {
                editableConfig
                    .onSwapRows(dataPortion[rowIndex1], dataPortion[rowIndex2])
                    .then(clientSideRefresh);
            } else {
                clientSideRefresh();
            }
        };
        columns.unshift({
            name: "",
            cell: (row: Row<Data>) => {
                const isRowDeletable = editableConfig.isDeletable
                    ? editableConfig.isDeletable(row.data)
                    : true;
                return (
                    <EditAndReorderArrowDiv>
                        {editableConfig.onSwapRows && (
                            <StyledIconButton
                                onClick={() => swapRows(row.rowId, true)}
                                aria-label="reorder row upwards"
                                disabled={isSwapping}
                            >
                                <StyledIcon icon={faAnglesUp} />
                            </StyledIconButton>
                        )}
                        {editableConfig.onEdit && (
                            <StyledIconButton
                                onClick={() => editableConfig.onEdit!(row.rowId)}
                                aria-label="edit"
                            >
                                <StyledIcon icon={faPenToSquare} />
                            </StyledIconButton>
                        )}
                        {editableConfig.onSwapRows && (
                            <StyledIconButton
                                onClick={() => swapRows(row.rowId, false)}
                                aria-label="reorder row downwards"
                                disabled={isSwapping}
                            >
                                <StyledIcon icon={faAnglesDown} />
                            </StyledIconButton>
                        )}
                        {editableConfig.onDelete && isRowDeletable && (
                            <StyledIconButton
                                onClick={() => {
                                    if (editableConfig.onDelete) {
                                        editableConfig.onDelete(row.rowId);
                                    }
                                }}
                                aria-label="delete"
                            >
                                <StyledIcon icon={faTrashAlt} />
                            </StyledIconButton>
                        )}
                    </EditAndReorderArrowDiv>
                );
            },
            width: "5rem",
        });
    }

    if (checkboxConfig.displayed) {
        columns.unshift({
            name: (
                <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={checkboxConfig.isAllCheckboxChecked}
                    onClick={() =>
                        checkboxConfig.onAllCheckboxClicked(checkboxConfig.isAllCheckboxChecked)
                    }
                />
            ),
            cell: (row: Row<Data>) => (
                <input
                    type="checkbox"
                    aria-label={`Select row ${row.rowId}`}
                    checked={checkboxConfig.isRowChecked(row.data)}
                    onClick={() => checkboxConfig.onCheckboxClicked(row.data)}
                />
            ),
            width: "47px",
            ignoreRowClick: true,
        });
    }

    const rows = dataPortion.map((data, index) => ({ rowId: index, data }));

    const handleClear = (): void => {
        if (filterConfig.primaryFiltersShown) {
            filterConfig.setPrimaryFilters(
                filterConfig.primaryFilters.map((filter) => ({
                    ...filter,
                    state: filter.initialState,
                }))
            );
        }
        if (filterConfig.additionalFiltersShown) {
            filterConfig.setAdditionalFilters(
                filterConfig.additionalFilters.map((filter) => ({
                    ...filter,
                    state: filter.initialState,
                }))
            );
        }
    };

    return (
        <>
            <TableFilterAndExtraColumnsBar<Data, DBRow>
                handleClear={handleClear}
                setFilters={
                    filterConfig.primaryFiltersShown ? filterConfig.setPrimaryFilters : () => {}
                }
                toggleableHeaders={toggleableHeaders}
                filters={filterConfig.primaryFiltersShown ? filterConfig.primaryFilters : []}
                additionalFilters={
                    filterConfig.additionalFiltersShown ? filterConfig.additionalFilters : []
                }
                setAdditionalFilters={
                    filterConfig.additionalFiltersShown
                        ? filterConfig.setAdditionalFilters
                        : () => {}
                }
                headers={headerKeysAndLabels}
                setShownHeaderKeys={setShownHeaderKeys}
                shownHeaderKeys={shownHeaderKeys}
            />
            <TableStyling>
                <NoSsr>
                    <DataTable
                        columns={columns}
                        data={rows}
                        keyField="rowId"
                        fixedHeader
                        pagination={paginationConfig.enablePagination}
                        persistTableHead
                        onRowClicked={onRowClick}
                        paginationServer={paginationConfig.enablePagination}
                        paginationTotalRows={
                            paginationConfig.enablePagination
                                ? paginationConfig.filteredCount
                                : undefined
                        }
                        paginationPerPage={
                            paginationConfig.enablePagination
                                ? paginationConfig.defaultRowsPerPage
                                : undefined
                        }
                        paginationRowsPerPageOptions={
                            paginationConfig.enablePagination
                                ? paginationConfig.rowsPerPageOptions
                                : undefined
                        }
                        paginationDefaultPage={paginationConfig.enablePagination ? 1 : undefined}
                        onChangePage={
                            paginationConfig.enablePagination
                                ? paginationConfig.onPageChange
                                : () => {}
                        }
                        onChangeRowsPerPage={
                            paginationConfig.enablePagination
                                ? paginationConfig.onPerPageChange
                                : () => {}
                        }
                        sortServer={sortConfig.sortPossible}
                        onSort={handleSort}
                        progressComponent={
                            <Centerer role="rowgroup">
                                <CircularProgress
                                    role="row"
                                    aria-label="table-progress-bar"
                                    aria-busy={true}
                                />
                            </Centerer>
                        }
                        progressPending={isLoading}
                        pointerOnHover={pointerOnHover}
                        striped
                    />
                </NoSsr>
            </TableStyling>
        </>
    );
};

const EditAndReorderArrowDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    // this transform is necessary to make the buttons visually consistent with the rest of the table without redesigning the layout
    transform: translateX(-1.2rem);
`;

const StyledIcon = styled(Icon)`
    cursor: pointer;
    padding: 0;
    margin: 0;
`;

const TableStyling = styled.div`
    // the component with the filter bars
    & > header {
        background-color: transparent;
        padding: 0;
    }

    // the entire table component including the header and the pagination bar
    & > div {
        border-radius: 1rem;
        background-color: transparent;

        // the pagination bar
        > nav {
            background-color: transparent;
            color: ${(props) => props.theme.main.foreground[0]};
            border: none;
            margin-top: 0.5em;
            font-size: 1rem;

            & option {
                color: ${(props) => props.theme.main.foreground[0]};
                background-color: ${(props) => props.theme.main.background[0]};
            }
        }
    }

    // the icons in the pagination bar
    & svg {
        fill: ${(props) => props.theme.main.lighterForeground[0]};
    }

    // formatting all direct children to adhere to the theme
    & > div {
        background-color: ${(props) => props.theme.main.background[0]};
        color: ${(props) => props.theme.main.foreground[0]};
        border-color: ${(props) => props.theme.main.border};
    }

    // the filter bars
    & input[type="text"] {
        color: ${(props) => props.theme.main.lighterForeground[1]};
        background-color: ${(props) => props.theme.main.background[1]};
        border-radius: 0.5rem;
        border: solid 1px ${(props) => props.theme.main.lighterForeground[1]};

        &::placeholder {
            color: ${(props) => props.theme.main.lighterForeground[1]};
        }

        margin: 1px 2px 1px 2px;
        width: 10rem;
    }

    & div.rdt_TableCell,
    & div.rdt_TableCol {
        // important needed to override the inline style
        padding: 0 0 0 1rem;

        // allowing text overflow so the titles don't get unnecessarily clipped due to react-data-table's layout
        & > * {
            overflow: visible;
        }
    }

    // the table itself
    & .rdt_TableCell,
    & .rdt_TableCol_Sortable,
    & .rdt_TableHeadRow,
    & .rdt_TableCol,
    & .rdt_Table {
        text-align: start;
        font-size: 1rem;
        background-color: transparent;
        color: ${(props) => props.theme.main.foreground[2]};
    }

    & .rdt_Table {
        border-color: ${(props) => props.theme.main.border};
    }

    & div.rdt_TableRow {
        padding: 0.5rem 0.5rem;
        // important needed to override the inline style
        border-bottom-color: ${(props) => props.theme.main.border};
    }

    & div.rdt_TableRow:hover {
        background-color: ${(props) => props.theme.primary.background[1]};
    }

    & .rdt_TableHeadRow {
        padding: 0.5rem 0.5rem;
        background-color: ${(props) => props.theme.main.background[2]};
        border-color: ${(props) => props.theme.main.border};

        font-weight: bold;
    }

    & .rdt_TableCell {
        // the div containing the text
        & > div {
            white-space: normal;
        }
    }

    & .rdt_Table > div {
        background-color: transparent;
        color: ${(props) => props.theme.main.foreground[2]};
    }

    & .rdt_TableRow {
        text-align: start;
        font-size: 1rem;
        background-color: ${(props) => props.theme.main.background[1]};
    }

    & .rdt_TableRow:nth-child(odd) {
        background-color: ${(props) => props.theme.main.background[0]};
    }
`;

export default Table;
