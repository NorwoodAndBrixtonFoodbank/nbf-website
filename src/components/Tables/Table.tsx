"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar, { FilterText } from "@/components/Tables/TableFilterBar";

interface Row {
    rowId: number;
    [key: string]: string | number;
}
interface Headers {
    [key: string]: string;
}

export interface Datum {
    [key: string]: string | number | null;
}

interface Props {
    data: Datum[];
    headers: Headers;
}

const itemIncludesFilterText = (headers: Headers, item: Datum, filterText: FilterText): boolean => {
    for (const key of Object.keys(headers)) {
        if (
            !(item[key] ?? "")
                .toString()
                .toLowerCase()
                .includes((filterText[key] ?? "").toLowerCase())
        ) {
            return false;
        }
    }
    return true;
};

const datumToRowItems = (headers: Headers, data: Datum[]): Row[] => {
    return data.map((item: Datum, currentIndex: number) => {
        const rowItem: Row = { rowId: currentIndex };
        for (const key of Object.keys(headers)) {
            rowItem[key] = item[key] ?? "";
        }
        return rowItem;
    });
};

const filteredItems = (headers: Headers, datumToRowItems: Row[], filterText: FilterText): Row[] => {
    return datumToRowItems.filter((item) => itemIncludesFilterText(headers, item, filterText));
};
const filterData = (headers: Headers, data: Datum[], filterText: FilterText): Row[] => {
    const datumToRow = datumToRowItems(headers, data);
    const filtered = filteredItems(headers, datumToRow, filterText);
    return filtered;
};

const Table: React.FC<Props> = (props) => {
    const [filterText, setFilterText] = useState<FilterText>({});

    const [selectCheckBox, setSelectCheckBox] = useState(
        new Array<boolean>(props.data.length).fill(false)
    );
    const [selectAllCheckBox, setSelectAllCheckBox] = useState(false);

    const toggleAllCheckBox = (): void => {
        setSelectCheckBox(new Array<boolean>(props.data.length).fill(!selectAllCheckBox));
        setSelectAllCheckBox(!selectAllCheckBox);
    };
    const toggleOwnCheckBox = (rowId: number): void => {
        const selectCheckBoxCopy = [...selectCheckBox];
        selectCheckBoxCopy[rowId] = !selectCheckBoxCopy[rowId];
        setSelectCheckBox(selectCheckBoxCopy);
    };

    // Fixes hydration error by re-rendering when the DOM is ready - https://nextjs.org/docs/messages/react-hydration-error
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    useEffect(() => {
        const allChecked = selectCheckBox.every((item) => item);
        if (allChecked !== selectAllCheckBox) {
            setSelectAllCheckBox(allChecked);
        }
    }, [selectCheckBox, selectAllCheckBox]);

    const columns: TableColumn<Row>[] = Object.entries(props.headers).map(([key, value]) => {
        return {
            name: value,
            selector: (row: Row) => row[key],
            sortable: true,
        };
    });

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
                checked={selectCheckBox[row.rowId]}
                onClick={() => toggleOwnCheckBox(row.rowId)}
            />
        ),
        width: "47px",
    });

    const onFilter = (event: React.ChangeEvent<HTMLInputElement>, filterField: string): void => {
        setFilterText({ ...filterText, [filterField]: event.target.value });
    };

    const handleClear = (): void => {
        if (filterText) {
            setFilterText({});
        }
    };

    if (!domLoaded) {
        return <></>;
    }

    return (
        <DataTable
            columns={columns}
            data={filterData(props.headers, props.data, filterText)}
            keyField="rowId"
            subHeader
            subHeaderComponent={
                <TableFilterBar
                    filterText={filterText}
                    onFilter={onFilter}
                    handleClear={handleClear}
                    headers={props.headers}
                />
            }
            pagination
            persistTableHead
        />
    );
};

export default Table;
