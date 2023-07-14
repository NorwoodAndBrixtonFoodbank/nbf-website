"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar, { FilterText } from "./TableFilterBar";

interface Row {
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
    return data.reduce((filteredNoNullItems: Row[], item: Datum) => {
        if (itemIncludesFilterText(headers, item, filterText)) {
            const noNullItem: Row = {};
            for (const key of Object.keys(headers)) {
                noNullItem[key] = item[key] ?? "";
            }
            filteredNoNullItems.push(noNullItem);
        }
        return filteredNoNullItems;
    }, []);
};

const Table: React.FC<Props> = (props) => {
    const [filterText, setFilterText] = useState<FilterText>({});

    // Fixes hydration error by re-rendering when the DOM is ready - https://nextjs.org/docs/messages/react-hydration-error
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    const columns: TableColumn<Row>[] = Object.entries(props.headers).map(([key, value]) => {
        return {
            name: value,
            selector: (row: Row) => row[key],
            sortable: true,
            title: value,
        };
    });

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>, filterField: string): void => {
        setFilterText({ ...filterText, [filterField]: e.target.value });
    };

    const handleClear: () => void = () => {
        if (filterText) {
            setFilterText({});
        }
    };

    return (
        <>
            {domLoaded && (
                <DataTable
                    columns={columns}
                    data={filteredNoNullItems(props.headers, props.data, filterText)}
                    subHeader
                    subHeaderComponent={TableFilterBar({
                        filterText,
                        onFilter,
                        handleClear,
                        headers: props.headers,
                    })}
                    pagination
                    selectableRows
                    persistTableHead
                />
            )}
        </>
    );
};

export default Table;
