"use client";

import React, { ReactNode, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar, { FilterText } from "@/components/Tables/TableFilterBar";
import styled from "styled-components";
import { NoSsr } from "@mui/material";
import {
    faAnglesUp,
    faAnglesDown,
    faPenToSquare,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton/IconButton";
import Icon from "@/components/Icons/Icon";

export interface Datum {
    [headerKey: string]: string | boolean | null;
}

export type TableHeaders = [string, string][];

export interface Row {
    rowId: number;
    data: Datum;
}

export type ColumnDisplayFunction = (row: Row) => ReactNode;
export type OnRowClickFunction = (row: Row, e: React.MouseEvent<Element, MouseEvent>) => void;

export interface ColumnStyleOptions {
    grow?: number;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    right?: boolean;
    center?: boolean;
    wrap?: boolean;
    allowOverflow?: boolean;
    hide?: number;
}

interface Props {
    data: Datum[];
    headerKeysAndLabels: TableHeaders;
    checkboxes?: boolean;
    onRowSelection?: (rowIds: number[]) => void;
    reorderable?: boolean;
    headerFilters?: string[];
    pagination?: boolean;
    defaultShownHeaders?: string[];
    toggleableHeaders?: string[];
    sortable?: boolean;
    onEdit?: (data: number) => void;
    onDelete?: (data: number) => void;
    columnDisplayFunctions?: { [headerKey: string]: ColumnDisplayFunction };
    columnStyleOptions?: { [headerKey: string]: ColumnStyleOptions };
    onRowClick?: OnRowClickFunction;
}

const doesRowIncludeFilterText = (
    row: Row,
    filterText: FilterText,
    headers: TableHeaders
): boolean => {
    for (const [headerKey, _headerLabel] of headers) {
        if (
            !(row.data[headerKey] ?? "")
                .toString()
                .toLowerCase()
                .includes((filterText[headerKey] ?? "").toLowerCase())
        ) {
            return false;
        }
    }
    return true;
};

const dataToFilteredRows = (
    data: Datum[],
    filterText: FilterText,
    headers: TableHeaders
): Row[] => {
    const rows = dataToRows(data, headers);
    return filterRows(rows, filterText, headers);
};

const dataToRows = (data: Datum[], headers: TableHeaders): Row[] => {
    return data.map((datum: Datum, currentIndex: number) => {
        const row: Row = { rowId: currentIndex, data: { ...datum } };

        for (const [headerKey, _headerLabel] of headers) {
            const databaseValue = datum[headerKey] ?? "";
            row.data[headerKey] = Array.isArray(databaseValue)
                ? databaseValue.join(", ")
                : databaseValue;
        }

        return row;
    });
};

const filterRows = (rows: Row[], filterText: FilterText, headers: TableHeaders): Row[] => {
    return rows.filter((row) => doesRowIncludeFilterText(row, filterText, headers));
};

interface CellProps {
    row: Row;
    columnDisplayFunctions: { [headerKey: string]: ColumnDisplayFunction };
    headerKey: string;
}

const CustomCell: React.FC<CellProps> = ({ row, columnDisplayFunctions, headerKey }) => {
    return (
        <>
            {columnDisplayFunctions[headerKey]
                ? columnDisplayFunctions[headerKey](row)
                : row.data[headerKey]}
        </>
    );
};

const StyledIconButton = styled(IconButton)`
    padding: 0.1rem;
    margin: 0.1rem;
`;

const defaultColumnStyleOptions: ColumnStyleOptions = {
    grow: 1,
    minWidth: "2rem",
    maxWidth: "20rem",
};

const Table: React.FC<Props> = ({
    data: inputData,
    headerKeysAndLabels,
    checkboxes,
    onRowSelection,
    defaultShownHeaders,
    headerFilters,
    onDelete,
    onEdit,
    pagination,
    reorderable = false,
    sortable = true,
    toggleableHeaders,
    onRowClick,
    columnDisplayFunctions = {},
    columnStyleOptions = {},
}) => {
    const [shownHeaderKeys, setShownHeaderKeys] = useState(
        defaultShownHeaders ?? headerKeysAndLabels.map(([key]) => key)
    );

    const shownHeaders = headerKeysAndLabels.filter(([key]) => shownHeaderKeys.includes(key));

    const [data, setData] = useState(inputData);

    const [filterText, setFilterText] = useState<FilterText>({});

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

    const columns: TableColumn<Row>[] = (
        toggleableHeaders ? shownHeaders : headerKeysAndLabels
    ).map(([headerKey, headerName]) => {
        const columnStyles = Object.assign(
            { ...defaultColumnStyleOptions },
            columnStyleOptions[headerKey] ?? {}
        );

        return {
            name: headerName,
            selector: (row) => row.data[headerKey] ?? "",
            sortable: sortable,
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
            cell: (row: Row) => (
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

    if (reorderable || onEdit) {
        columns.unshift({
            name: <p>Sort</p>,
            cell: (row: Row) => {
                const onEditClick = (): void => {
                    onEdit!(row.rowId);
                };

                return (
                    <EditAndReorderArrowDiv>
                        {reorderable ? (
                            <StyledIconButton
                                onClick={() => swapRows(row.rowId, row.rowId - 1)}
                                aria-label="reorder row upwards"
                            >
                                <StyledIcon icon={faAnglesUp} />
                            </StyledIconButton>
                        ) : (
                            <></>
                        )}
                        {onEdit ? (
                            <StyledIconButton onClick={onEditClick} aria-label="edit">
                                <StyledIcon icon={faPenToSquare} />
                            </StyledIconButton>
                        ) : (
                            <></>
                        )}
                        {reorderable ? (
                            <StyledIconButton
                                onClick={() => swapRows(row.rowId, row.rowId + 1)}
                                aria-label="reorder row downwards"
                            >
                                <StyledIcon icon={faAnglesDown} />
                            </StyledIconButton>
                        ) : (
                            <></>
                        )}
                        {onDelete ? (
                            <StyledIconButton
                                onClick={() => onDelete!(row.rowId)}
                                aria-label="delete"
                            >
                                <StyledIcon icon={faTrashAlt} />
                            </StyledIconButton>
                        ) : (
                            <></>
                        )}
                    </EditAndReorderArrowDiv>
                );
            },
            width: "5rem",
        });
    }

    const onFilter = (event: React.ChangeEvent<HTMLInputElement>, filterField: string): void => {
        setFilterText({ ...filterText, [filterField]: event.target.value });
    };

    const handleClear = (): void => {
        if (filterText) {
            setFilterText({});
        }
    };

    const filterKeys = headerFilters ?? headerKeysAndLabels.map(([headerKey]) => headerKey);

    return (
        <Styling>
            <NoSsr>
                <DataTable
                    // types are fine without the cast when not using styled components, not sure what's happening here
                    columns={columns}
                    data={dataToFilteredRows(data, filterText, headerKeysAndLabels)}
                    keyField="rowId"
                    fixedHeader
                    subHeader
                    subHeaderComponent={
                        <TableFilterBar
                            filterText={filterText}
                            filterKeys={filterKeys}
                            toggleableHeaders={toggleableHeaders}
                            onFilter={onFilter}
                            handleClear={handleClear}
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
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 10px;
        gap: min(1rem, 5vw);
        overflow: visible;
        @media (min-width: 500px) {
            flex-wrap: nowrap;
        }

        // the clear button
        & > button {
            border-radius: 0.4rem;
        }
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
