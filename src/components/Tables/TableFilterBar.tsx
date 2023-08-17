"use client";

import React from "react";
import styled from "styled-components";
import FilterAccordion from "@/components/Tables/FilterAccordion";
import Button from "@mui/material/Button";
import CheckboxInput from "../DataInput/CheckboxInput";
import { TableHeaders } from "./Table";

const StyledFilterAccordion = styled(FilterAccordion)`
    width: 100%;
    overflow: visible;
    margin-bottom: 4px;
`;

const StyledFilterBar = styled.input`
    font-size: 14px;
    width: 15rem;
    overflow: visible;
    box-shadow: none;
    padding: 4px 12px 4px 12px;

    &:focus {
        outline: none;
    }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    text-align: left;
    border: 1px solid ${(props) => props.theme.main.lighterForeground[2]};
    padding: 0 1rem;
    border-radius: 0.5rem;

    & label {
        margin-right: 0;
    }
`;

interface Props<Data> {
    onFilter: (event: React.ChangeEvent<HTMLInputElement>, filterField: keyof Data) => void;
    handleClear: () => void;
    headers: TableHeaders<Data>;
    filterKeys: [keyof Data, FilterType][];
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

interface FilterElementProps {
    filterType: FilterType;
    key: string;
    label: string;
    defaultValue: string;
    onFilter: (event: React.ChangeEvent<HTMLInputElement>, filterField: string) => void;
}

const FilterElement: React.FC<FilterElementProps> = ({
    filterType,
    key,
    onFilter,
    defaultValue,
    label,
}) => {
    switch (filterType) {
        case FilterType.Text:
            return (
                <StyledFilterBar
                    key={key}
                    type="text"
                    value={defaultValue}
                    placeholder={`Filter by ${label}`}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFilter(event, key)}
                />
            );
        case FilterType.Toggle:
            return (
                <Row key={key}>
                    <CheckboxInput
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            onFilter(event, key)
                        }
                    />
                    {label}
                </Row>
            );
    }
};

const TableFilterBar = <Data extends unknown>(props: Props<Data>): React.ReactElement => {
    return (
        <>
            <Button variant="contained" onClick={props.handleClear}>
                Clear
            </Button>
            {props.filterKeys.map(([key, filterType]) => {
                const label = props.headers.find(([headerKey]) => headerKey === key)?.[1] ?? "";
                // const defaultValue = props.filterText[key] ?? "";

                return (
                    <FilterElement
                        {...{ label, filterType, onFilter: props.onFilter }}
                        key={label}
                    />
                );
            })}
            {/* <StyledFilterAccordion
                toggleableHeaders={props.toggleableHeaders}
                shownHeaderKeys={props.shownHeaderKeys}
                setShownHeaderKeys={props.setShownHeaderKeys}
                headers={props.headers}
            /> */}
        </>
    );
};

export default TableFilterBar;
