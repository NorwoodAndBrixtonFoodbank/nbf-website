"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar, { FilterText } from "./TableFilterBar";

interface Row {
    checkBoxKey: number;
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

const filteredNoNullItems = (headers: Headers, data: Datum[], filterText: FilterText): Row[] => {
    let row = 0;
    return data.reduce((filteredNoNullList: Row[], item: Datum, currentIndex: number) => {
        if (itemIncludesFilterText(headers, item, filterText)) {
            const noNullItem: Row = { checkBoxKey: currentIndex };
            for (const key of Object.keys(headers)) {
                noNullItem[key] = item[key] ?? "";
            }
            noNullItem.id = row;
            filteredNoNullList.push(noNullItem);
            row++;
        }
        return filteredNoNullList;
    }, []);
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
    const toggleOwnCheckBox = (checkBoxKey: number): void => {
        const selectCheckBoxCopy = [...selectCheckBox];
        selectCheckBoxCopy[checkBoxKey] = !selectCheckBoxCopy[checkBoxKey];
        setSelectCheckBox(selectCheckBoxCopy);
    };

    // Fixes hydration error by re-rendering when the DOM is ready - https://nextjs.org/docs/messages/react-hydration-error
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    useEffect(() => {
        let toggleFlag = true;
        selectCheckBox.forEach((eachCheckBox) => {
            if (!eachCheckBox) {
                toggleFlag = false;
            }
        });
        setSelectAllCheckBox(toggleFlag);
    }, [selectCheckBox]);

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
                aria-label={`Select row ${row.checkBoxKey}`}
                checked={selectCheckBox[Number(row.checkBoxKey)]}
                onClick={() => toggleOwnCheckBox(Number(row.checkBoxKey))}
            />
        ),
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
            data={filteredNoNullItems(props.headers, props.data, filterText)}
            keyField="id"
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
