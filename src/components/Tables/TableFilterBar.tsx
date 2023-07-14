"use client";

import React from "react";

export interface FilterText {
    [key: string]: string;
}

interface Props {
    filterText: FilterText;
    onFilter: (e: React.ChangeEvent<HTMLInputElement>, filterField: string) => void;
    handleClear: () => void;
    headers: FilterText;
}

const TableFilterBar: React.FC<Props> = (props) => {
    return (
        <>
            {Object.entries(props.headers).map(([key, value]) => {
                return (
                    <input
                        key={key}
                        type="text"
                        value={props.filterText[key] ?? ""}
                        placeholder={`Filter by ${value}`}
                        onChange={(e) => props.onFilter(e, key)}
                    />
                );
            })}
            <button onClick={props.handleClear}>Clear</button>
        </>
    );
};

export default TableFilterBar;
