"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar from "@/components/Tables/TableFilterBar";
import { NoSsr } from "@mui/material";
import {
    faAnglesUp,
    faAnglesDown,
    faPenToSquare,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton/IconButton";
import Icon from "@/components/Icons/Icon";
import { Filter, headerLabelFromKey, textFilter } from "@/components/Tables/Filters";
import { Primitive } from "react-data-table-component/dist/src/DataTable/types";

export type TableHeaders<Data> = readonly (readonly [keyof Data, string])[];

type OnRowClickFunction = (row: Row, event: React.MouseEvent<Element, MouseEvent>) => void;

type ColumnDisplayFunction = (row: Row) => React.ReactNode;

export type TableHeaders = [string, string][];

export interface Datum {
    [headerKey: string]: string | number | boolean | null;
}

export interface Row<Data> {
    rowId: number;
    data: Data;
}

export type ColumnDisplayFunction<T> = (data: T) => ReactNode;
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

export interface SortOptions<Data, Key extends keyof Data> {
    key: Key;
    sortFunction?: (datapoint1: Data[Key], datapoint2: Data[Key]) => number;
}

interface Props<Data> {
    data: Data[];
    headerKeysAndLabels: TableHeaders<Data>;
    checkboxes?: boolean;
    onRowSelection?: (rowIds: number[]) => void;
    reorderable?: boolean;
    filters?: (Filter<Data, any> | keyof Data)[];
    additionalFilters?: (Filter<Data, any> | keyof Data)[];
    pagination?: boolean;
    defaultShownHeaders?: readonly (keyof Data)[];
    toggleableHeaders?: readonly (keyof Data)[];
    sortable?: (keyof Data | SortOptions<Data, any>)[];
    onEdit?: (data: number) => void;
    onDelete?: (data: number) => void;
    columnDisplayFunctions?: ColumnDisplayFunctions<Data>;
    columnStyleOptions?: ColumnStyles<Data>;
    onRowClick?: OnRowClickFunction<Data>;
    autoFilter?: boolean;
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

const Table = <Data,>({
    data: inputData,
    headerKeysAndLabels,
    checkboxes,
    onRowSelection,
    defaultShownHeaders,
    filters: filterKeysOrObjects = [],
    additionalFilters: additionalFilterKeysOrObjects = [],
    onDelete,
    onEdit,
    pagination,
    reorderable = false,
    sortable = [],
    toggleableHeaders = [],
    onRowClick,
    columnDisplayFunctions = {},
    columnStyleOptions = {},
    autoFilter = true,
}: Props<Data>): ReactElement => {
    const [shownHeaderKeys, setShownHeaderKeys] = useState(
        defaultShownHeaders ?? headerKeysAndLabels.map(([key]) => key)
    );

    const shownHeaders = headerKeysAndLabels.filter(([key]) => shownHeaderKeys.includes(key));

    const toFilter = (filter: Filter<Data, any> | keyof Data): Filter<Data, any> => {
        if (filter instanceof Object) {
            return filter;
        }
        return textFilter<Data, keyof Data>({
            key: filter,
            label: headerLabelFromKey(headerKeysAndLabels, filter),
        });
    };

    const [primaryFilters, setPrimaryFilters] = useState(filterKeysOrObjects.map(toFilter));

    const [additionalFilters, setAdditionalFilters] = useState(
        additionalFilterKeysOrObjects.map(toFilter)
    );

    const allFilters = [...primaryFilters, ...additionalFilters];

    const [data, setData] = useState(inputData);

    const [selectedCheckboxes, setSelectedCheckboxes] = useState(
        new Array<boolean>(data.length).fill(false)
    );

    const updateCheckboxes = (newSelection: boolean[]): void => {
        setSelectedCheckboxes(newSelection);
        onRowSelection?.(
            newSelection
                .map((selected, index) => (selected ? index : -1))
                .filter((index) => index !== -1)
        );
    };

    const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);

    const toggleOwnCheckBox = (rowId: number): void => {
        const selectCheckBoxesCopy = [...selectedCheckboxes];
        selectCheckBoxesCopy[rowId] = !selectCheckBoxesCopy[rowId];
        updateCheckboxes(selectCheckBoxesCopy);
    };

    const toggleAllCheckBox = (): void => {
        const newSelection = new Array<boolean>(data.length).fill(!selectAllCheckBox);
        updateCheckboxes(newSelection);
        setSelectAllCheckBox(!selectAllCheckBox);
    };

    useEffect(() => {
        const allChecked = selectedCheckboxes.every((item) => item);
        if (allChecked !== selectAllCheckBox) {
            setSelectAllCheckBox(allChecked);
        }
    }, [selectedCheckboxes, selectAllCheckBox]);

    const sortOptions = sortable.map((sortOption) => {
        if (sortOption instanceof Object) {
            return sortOption;
        }
        return {
            key: sortOption,
        };
    });

    const columns: TableColumn<Row<Data>>[] = shownHeaders.map(([headerKey, headerName]) => {
        const columnStyles = Object.assign(
            { ...defaultColumnStyleOptions },
            columnStyleOptions[headerKey] ?? {}
        );

        const sortOption = sortOptions.find((sortOption) => sortOption.key === headerKey);

        const sortFunction = sortOption?.sortFunction;
        const sortable = sortOption !== undefined;

        return {
            name: <>{headerName}</>,
            selector: (row) => row.data[headerKey] as Primitive, // The type cast here is needed as the type of selector is (row) => Primitive, but as we are using a custom cell, we can have it be anything
            sortable,
            sortFunction: sortFunction
                ? (row1, row2) => sortFunction(row1.data[headerKey], row2.data[headerKey])
                : undefined,
            cell(row) {
                return (
                    <CustomCell
                        row={row}
                        columnDisplayFunctions={columnDisplayFunctions}
                        headerKey={headerKey}
                    />
                );
            },
            ...columnStyles,
        };
    });

    const swapRows = (rowId1: number, rowId2: number): void => {
        if (rowId1 < 0 || rowId2 < 0 || rowId1 >= data.length || rowId2 >= data.length) {
            return;
        }

        const newData = [...data];
        const temp = newData[rowId1];
        newData[rowId1] = newData[rowId2];
        newData[rowId2] = temp;

        setData(newData);
    };

    if (checkboxes) {
        columns.unshift({
            name: (
                <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={selectAllCheckBox}
                    onClick={toggleAllCheckBox}
                />
            ),
            cell: (row: Row<Data>) => (
                <input
                    type="checkbox"
                    aria-label={`Select row ${row.rowId}`}
                    checked={selectedCheckboxes[row.rowId]}
                    onClick={() => toggleOwnCheckBox(row.rowId)}
                />
            ),
            width: "47px",
        });
    }

    if (reorderable || onEdit || onDelete) {
        columns.unshift({
            name: "",
            cell: (row: Row<Data>) => {
                const onEditClick = (): void => {
                    onEdit!(row.rowId);
                };

                return (
                    <EditAndReorderArrowDiv>
                        {reorderable && (
                            <StyledIconButton
                                onClick={() => swapRows(row.rowId, row.rowId - 1)}
                                aria-label="reorder row upwards"
                            >
                                <StyledIcon icon={faAnglesUp} />
                            </StyledIconButton>
                        )}
                        {onEdit && (
                            <StyledIconButton onClick={onEditClick} aria-label="edit">
                                <StyledIcon icon={faPenToSquare} />
                            </StyledIconButton>
                        )}
                        {reorderable && (
                            <StyledIconButton
                                onClick={() => swapRows(row.rowId, row.rowId + 1)}
                                aria-label="reorder row downwards"
                            >
                                <StyledIcon icon={faAnglesDown} />
                            </StyledIconButton>
                        )}
                        {onDelete && (
                            <StyledIconButton
                                onClick={() => onDelete!(row.rowId)}
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

    const rows = data.map((data, index) => ({ rowId: index, data }));

    const shouldFilterRow = (row: Row<Data>): boolean => {
        return allFilters.every((filter) => !filter.shouldFilter(row.data, filter.state));
    };

    const toDisplay = autoFilter ? rows.filter(shouldFilterRow) : rows;

    const handleClear = (): void => {
        setPrimaryFilters((filters) =>
            filters.map((filter) => ({
                ...filter,
                state: filter.initialState,
            }))
        );
        setAdditionalFilters((filters) =>
            filters.map((filter) => ({
                ...filter,
                state: filter.initialState,
            }))
        );
    };

    return (
        <Styling>
            <NoSsr>
                <DataTable
                    columns={columns}
                    data={toDisplay}
                    keyField="rowId"
                    fixedHeader
                    subHeader
                    subHeaderComponent={
                        <TableFilterBar<Data>
                            handleClear={handleClear}
                            setFilters={setPrimaryFilters}
                            toggleableHeaders={toggleableHeaders}
                            filters={primaryFilters}
                            additionalFilters={additionalFilters}
                            setAdditionalFilters={setAdditionalFilters}
                            headers={headerKeysAndLabels}
                            setShownHeaderKeys={setShownHeaderKeys}
                            shownHeaderKeys={shownHeaderKeys}
                        />
                    }
                    pagination={pagination ?? true}
                    persistTableHead
                    onRowClicked={onRowClick}
                />
            </NoSsr>
        </Styling>
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

const Styling = styled.div`
    // the component with the filter bars
    & > header {
        background-color: transparent;
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
    & .rdt_TableRow,
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
`;

export default Table;
