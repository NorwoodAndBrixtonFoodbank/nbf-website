"use client";

import React from "react";
import { styled } from "styled-components";
import FilterAccordion from "./Accordion";

export interface FilterText {
    [key: string]: string;
}
const StyledFilterAccordion = styled(FilterAccordion)`
    width: 100%;
`;

interface Props {
    filterText: FilterText;
    onFilter: (event: React.ChangeEvent<HTMLInputElement>, filterField: string) => void;
    handleClear: () => void;
    headers: [string, string][];
    filterKeys: string[];
    toggleableHeaders?: string[];
    setShownHeaderKeys: (headers: string[]) => void;
    shownHeaderKeys: string[];
}

const TableFilterBar: React.FC<Props> = (props) => {
    return (
        <>
            <button onClick={props.handleClear}>Clear</button>
            {props.headers
                .filter(([key, _value]) => props.filterKeys?.includes(key) ?? true)
                .map(([key, value]) => {
                    return (
                        <input
                            key={key}
                            type="text"
                            value={props.filterText[key] ?? ""}
                            placeholder={`Filter by ${value}`}
                            onChange={(event) => props.onFilter(event, key)}
                        />
                    );
                })}
            <StyledFilterAccordion
                toggleableHeaders={props.toggleableHeaders}
                shownHeaderKeys={props.shownHeaderKeys}
                setShownHeaderKeys={props.setShownHeaderKeys}
                headers={props.headers}
            />
        </>
    );
};

export default TableFilterBar;
