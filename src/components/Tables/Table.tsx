"use client";

import React, { useState, useMemo, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar from "./TableFilterBar";

interface Row {
    [key: string]: string | number;
}

interface Data {
    [key: string]: string | number | null;
}

interface Headers {
    [key: string]: string;
}

interface Props {
    data: Data[];
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

const checkIfItemIncludesFilterText = (
    itemKey: string | number | null,
    filterTextKey: string | null
): boolean => {
    return (itemKey ?? "")
        .toString()
        .toLowerCase()
        .includes((filterTextKey ?? "").toLowerCase());
};

const replaceNullData = (dataArray: Data[], headers: Headers): Row[] => {
    return dataArray.map((item) => {
        let newItem: Row = {};
        for (const key of Object.keys(headers)) {
            newItem[key] = item[key] ?? "";
        }
        return newItem;
    });
};

const Table: React.FC<Props> = (props) => {
    const [filterText, setFilterText] = useState<Headers>({});

    // Fixes hydration error by re-rendering when the DOM is ready - https://nextjs.org/docs/messages/react-hydration-error
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    const filteredItems: Data[] = props.data.filter((item) => {
        for (const key of Object.keys(props.headers)) {
            if (!checkIfItemIncludesFilterText(item[key], filterText[key])) {
                return false;
            }
        }
        return true;
    });

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
                    data={replaceNullData(filteredItems, props.headers)}
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
