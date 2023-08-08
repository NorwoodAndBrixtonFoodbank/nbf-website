"use client";

import React from "react";
import styled from "styled-components";
import FilterAccordion from "@/components/Tables/FilterAccordion";
import Button from "@mui/material/Button";

export interface FilterText {
    [key: string]: string;
}

const StyledFilterAccordion = styled(FilterAccordion)`
    width: 100%;
    overflow: visible;
`;

const StyledFilterBar = styled.input`
    height: 39px;
    font-size: 14px;
    width: 15rem;
    overflow: visible;
    box-shadow: none;
    padding: 4px 12px 4px 12px;

    &:focus {
        outline: none;
    }
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
            <Button variant="contained" onClick={props.handleClear}>
                Clear
            </Button>
            {props.headers
                .filter(([key]) => props.filterKeys?.includes(key) ?? true)
                .map(([key, value]) => {
                    return (
                        <>
                            <StyledFilterBar
                                key={key}
                                type="text"
                                value={props.filterText[key] ?? ""}
                                placeholder={`Filter by ${value}`}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    props.onFilter(event, key)
                                }
                            />
                        </>
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
