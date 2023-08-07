"use client";

// TODO Fix types in TABLE

import React, { ReactNode, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar, { FilterText } from "@/components/Tables/TableFilterBar";
import { styled } from "styled-components";
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
    [headerKey: string]: string;
}

export interface Tooltips {
    [headerKey: string]: string;
}

export type TableHeaders = [string, string][];

export interface Row {
    rowId: number;
    data: Datum;
}

type ColumnDisplayFunction = (row: Row) => ReactNode;
type OnRowClickFunction = (row: Row, e: React.MouseEvent<Element, MouseEvent>) => void;

interface Props {
    data: Datum[];
    headerKeysAndLabels: TableHeaders;
    checkboxes?: boolean;
    reorderable?: boolean;
    headerFilters?: string[];
    pagination?: boolean;
    defaultShownHeaders?: string[];
    toggleableHeaders?: string[];
    sortable?: boolean;
    onEdit?: (data: number) => void;
    onDelete?: (data: number) => void;
    // TODO Change Types and Set Defaults
    columnDisplayFunctions?: { [headerKey: string]: ColumnDisplayFunction };
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
            // TODO Change special display values to use custom display functions instead
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
        <RowDiv key={row.rowId}>
            {columnDisplayFunctions[headerKey]
                ? columnDisplayFunctions[headerKey](row)
                : row.data[headerKey]}
        </RowDiv>
    );
};

// TODO Set default params instead of casting later

const Table: React.FC<Props> = ({
    data: inputData,
    headerKeysAndLabels,
    checkboxes,
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
}) => {
    const [shownHeaderKeys, setShownHeaderKeys] = useState(
        defaultShownHeaders ?? headerKeysAndLabels.map(([key]) => key)
    );

    const shownHeaders = headerKeysAndLabels.filter(([key]) => shownHeaderKeys.includes(key));

    const [data, setData] = useState(inputData);

    const [filterText, setFilterText] = useState<FilterText>({});

    const [selectCheckBoxes, setSelectCheckBoxes] = useState(
        new Array<boolean>(data.length).fill(false)
    );

    const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);

    const toggleOwnCheckBox = (rowId: number): void => {
        const selectCheckBoxesCopy = [...selectCheckBoxes];
        selectCheckBoxesCopy[rowId] = !selectCheckBoxesCopy[rowId];
        setSelectCheckBoxes(selectCheckBoxesCopy);
    };

    const toggleAllCheckBox = (): void => {
        setSelectCheckBoxes(new Array<boolean>(data.length).fill(!selectAllCheckBox));
        setSelectAllCheckBox(!selectAllCheckBox);
    };

    useEffect(() => {
        const allChecked = selectCheckBoxes.every((item) => item);
        if (allChecked !== selectAllCheckBox) {
            setSelectAllCheckBox(allChecked);
        }
    }, [selectCheckBoxes, selectAllCheckBox]);

    const columns: TableColumn<Row>[] = (
        toggleableHeaders ? shownHeaders : headerKeysAndLabels
    ).map(([headerKey, headerName]) => {
        return {
            name: headerName,
            selector: (row) => row.data[headerKey],
            minWidth: "12rem",
            maxWidth: "20rem",
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
                    checked={selectCheckBoxes[row.rowId]}
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
                            <IconButton
                                onClick={() => swapRows(row.rowId, row.rowId - 1)}
                                aria-label="reorder row upwards"
                            >
                                <StyledIcon icon={faAnglesUp} />
                            </IconButton>
                        ) : (
                            <></>
                        )}
                        {onEdit ? (
                            <IconButton onClick={onEditClick} aria-label="edit">
                                <StyledIcon icon={faPenToSquare} />
                            </IconButton>
                        ) : (
                            <></>
                        )}
                        {reorderable ? (
                            <IconButton
                                onClick={() => swapRows(row.rowId, row.rowId + 1)}
                                aria-label="reorder row downwards"
                            >
                                <StyledIcon icon={faAnglesDown} />
                            </IconButton>
                        ) : (
                            <></>
                        )}
                        {onDelete ? (
                            <IconButton onClick={() => onDelete!(row.rowId)} aria-label="delete">
                                <StyledIcon icon={faTrashAlt} />
                            </IconButton>
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
                    onRowClicked={onRowClick} // TODO Fix (not working for click on custom cell)
                />
            </NoSsr>
        </Styling>
    );
};

export const RowDiv = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    padding-left: 1rem;
    gap: 2rem;
`;

const EditAndReorderArrowDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    // this transform is necessary to make the buttons visually consistent with the rest of the table without redesigning the layout
    transform: translateX(-1.1rem);
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
        border-radius: 0;
        background-color: transparent;

        // the pagination bar
        > nav {
            background-color: transparent;
            color: ${(props) => props.theme.main.foreground[0]};
            border-top: solid 1px ${(props) => props.theme.main.border};
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
    & div.rdt_TableCol_Sortable,
    & div.rdt_TableCol {
        width: 7rem;
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
