"use client";

import React from "react";

interface Props {
    filterText: { [key: string]: string };
    onFilter: (e: React.ChangeEvent<HTMLInputElement>, filterField: string) => void;
    onClear: () => void;
    headers: { [key: string]: string };
}

const TableFilterBar: React.FC<Props> = ({ filterText, onFilter, onClear, headers }) => {
    return (
        <>
            {Object.entries(headers).map(([key, value]) => {
                return (
                    <input
                        key={key}
                        type="text"
                        value={filterText[key] ?? ""}
                        placeholder={`Filter by ${value}`}
                        onChange={(e) => onFilter(e, key)}
                    />
                );
            })}
            <button onClick={onClear}>Clear</button>
        </>
    );
};

export default TableFilterBar;
