"use client";

import React from "react";
import { styled } from "styled-components";
import FilterAccordion from "@/components/Tables/Accordion";

export type FilterText = {
    [key: string]: string;
};

const StyledFilterAccordion = styled(FilterAccordion)`
    width: 100%;
    overflow: visible;
`;

const ClearButton = styled.button`
    background-color: ${(props) => props.theme.secondaryBackgroundColor};
    color: ${(props) => props.theme.secondaryForegroundColor};
    box-shadow: 0 0 1px ${(props) => props.theme.secondaryBackgroundColor};
    height: 3rem;
    width: 6rem;
    font-size: 1rem;
`;

const StyledFilterBar = styled.input`
    height: 3rem;
    font-size: 1rem;
    width: 15rem;
    overflow: visible;
    border: 1px solid ${(props) => props.theme.secondaryBackgroundColor}!important;
    box-shadow: 0 0 1px ${(props) => props.theme.secondaryBackgroundColor};
    padding: 4px 4px 4px 8px !important;
    border-radius: 0.8rem;
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
            <ClearButton onClick={props.handleClear}>Clear</ClearButton>
            {props.headers
                .filter(([key]) => props.filterKeys?.includes(key) ?? true)
                .map(([key, value]) => {
                    return (
                        <StyledFilterBar
                            key={key}
                            type="text"
                            value={props.filterText[key] ?? ""}
                            placeholder={`Filter by ${value}`}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                props.onFilter(event, key)
                            }
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
