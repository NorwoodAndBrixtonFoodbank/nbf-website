"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar from "./TableFilterBar";

interface Row {
    [key: string]: string | number;
}
interface Headers {
    [key: string]: string;
}

interface Datum {
    [key: string]: string | number | null;
}

interface FilterText {
    [key: string]: string;
}

interface Props {
    data: Datum[];
    headers: Headers;
}

interface SubHeaderComponentProps {
    filterText: Headers;
    setFilterText: React.Dispatch<
        React.SetStateAction<{
            [key: string]: string;
        }>
    >;
    headers: Headers;
}

const subHeaderComponent: React.FC<SubHeaderComponentProps> = (props) => {
    const handleClear: () => void = () => {
        if (props.filterText) {
            props.setFilterText({});
        }
    };
    return (
        <TableFilterBar
            onFilter={(e: React.ChangeEvent<HTMLInputElement>, filterField: string): void => {
                const filterTextCopy = { ...props.filterText };
                filterTextCopy[filterField] = e.target.value;
                props.setFilterText(filterTextCopy);
            }}
            onClear={handleClear}
            filterText={props.filterText}
            headers={props.headers}
        />
    );
};

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
        };
    });

    return (
        <>
            {domLoaded && (
                <DataTable
                    columns={columns}
                    data={filteredNoNullItems(props.headers, props.data, filterText)}
                    subHeader
                    subHeaderComponent={subHeaderComponent({
                        filterText,
                        setFilterText,
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
