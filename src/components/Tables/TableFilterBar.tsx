"use client";

import React from "react";
// import styled from "styled-components";
import FilterAccordion from "@/components/Tables/FilterAccordion";
import Button from "@mui/material/Button";
import { TableHeaders } from "./Table";
import { Filter } from "./Filters";

// const StyledFilterAccordion = styled(FilterAccordion)`
//     width: 100%;
//     overflow: visible;
//     margin-bottom: 4px;
// `;

// const StyledFilterBar = styled.input`
//     font-size: 14px;
//     width: 15rem;
//     overflow: visible;
//     box-shadow: none;
//     padding: 4px 12px 4px 12px;

//     &:focus {
//         outline: none;
//     }
// `;

// const Row = styled.div`
//     display: flex;
//     align-items: center;
//     text-align: left;
//     border: 1px solid ${(props) => props.theme.main.lighterForeground[2]};
//     padding: 0 1rem;
//     border-radius: 0.5rem;

//     & label {
//         margin-right: 0;
//     }
// `;

interface Props<Data> {
    onFilter: (event: React.ChangeEvent<HTMLInputElement>, filterField: keyof Data) => void;
    handleClear: () => void;
    headers: TableHeaders<Data>;
    filters: Filter<Data>[];
    toggleableHeaders?: (keyof Data)[];
    setShownHeaderKeys: (headers: (keyof Data)[]) => void;
    shownHeaderKeys: (keyof Data)[];
}

export enum FilterType {
    Text,
    Toggle,
    Date,
}

export type FilterState<Data> = {
    [key in keyof Data]?: string;
};

const TableFilterBar = <Data extends unknown>(props: Props<Data>): React.ReactElement => {
    return (
        <>
            <Button variant="contained" onClick={props.handleClear}>
                Clear
            </Button>
            <FilterAccordion<Data>
                toggleableHeaders={props.toggleableHeaders}
                shownHeaderKeys={props.shownHeaderKeys}
                setShownHeaderKeys={props.setShownHeaderKeys}
                headers={props.headers}
            />
        </>
    );
};

export default TableFilterBar;
