"use client";

import React, { useState, useMemo, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import TableFilterBar from "./TableFilterBar";

interface Props {
    data: { [key: string]: string | number | null }[];
    headers: { [key: string]: string };
}

interface SubHeaderComponentProps {
    filterText: { [key: string]: string };
    setFilterText: React.Dispatch<
        React.SetStateAction<{
            [key: string]: string;
        }>
    >;
    headers: { [key: string]: string };
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

const Table: React.FC<Props> = (props) => {
    const [filterText, setFilterText] = useState<{ [key: string]: string }>({});

    // Fixes hydration error by re-rendering when the DOM is ready - https://nextjs.org/docs/messages/react-hydration-error
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    const filteredItems = props.data.filter((item) => {
        for (const key of Object.keys(props.headers)) {
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
    });

    const columns: TableColumn<any>[] = Object.entries(props.headers).map(([key, value]) => {
        return {
            name: value,
            selector: (row: any) => row[key],
            sortable: true,
        };
    });

    return (
        <div>
            {domLoaded && (
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    subHeader
                    subHeaderComponent={subHeaderComponent({
                        filterText,
                        setFilterText,
                        headers: props.headers
                    })}
                    pagination
                    selectableRows
                    persistTableHead
                />
            )}
        </div>
    );
};

export default Table;
