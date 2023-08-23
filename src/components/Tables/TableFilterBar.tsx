"use client";

import React from "react";
import FilterAccordion from "@/components/Tables/FilterAccordion";
import Button from "@mui/material/Button";
import { TableHeaders } from "@/components/Tables/Table";
import { Filter } from "@/components/Tables/Filters";
import styled from "styled-components";
import { FilterAltOffOutlined } from "@mui/icons-material";

interface Props<Data> {
    setFilters: (filters: Filter<Data, any>[]) => void;
    setAdditionalFilters: (filters: Filter<Data, any>[]) => void;
    handleClear: () => void;
    headers: TableHeaders<Data>;
    filters: Filter<Data, any>[];
    additionalFilters: Filter<Data, any>[];
    toggleableHeaders: readonly (keyof Data)[];
    setShownHeaderKeys: (headers: (keyof Data)[]) => void;
    shownHeaderKeys: readonly (keyof Data)[];
}

const StyledButton = styled(Button)`
    align-self: center;
    justify-self: flex-end;
`;

const Styling = styled.div`
    background-color: transparent;
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    padding: 0.5rem 0;
    gap: 2rem;
    overflow: visible;
    display: flex;
    width: 100%;

    @media (min-width: 500px) {
        flex-wrap: nowrap;
    }
`;

const FilterHeading = styled.h3`
    width: 100%;
    text-align: left;
`;

const Grow = styled.div`
    flex-grow: 1;
`;

const TableFilterBar = <Data extends unknown>(props: Props<Data>): React.ReactElement => {
    if (props.filters.length === 0 && props.toggleableHeaders.length === 0) {
        return <></>;
    }

    return (
        <>
            <FilterHeading>Filters</FilterHeading>
            <Styling>
                {props.filters.length > 0 && (
                    <>
                        {props.filters.map((filter, index) => {
                            const onFilter = (state: any): void => {
                                const newFilters = [...props.filters];
                                newFilters[index] = {
                                    ...newFilters[index],
                                    state,
                                };
                                props.setFilters(newFilters);
                            };
                            return filter.filterComponent(filter.state, onFilter);
                        })}
                        <Grow />
                        <StyledButton
                            variant="outlined"
                            onClick={props.handleClear}
                            color="primary"
                            startIcon={<FilterAltOffOutlined color="primary" />}
                        >
                            Clear
                        </StyledButton>
                    </>
                )}
            </Styling>
            {props.toggleableHeaders.length !== 0 && (
                <FilterAccordion
                    toggleableHeaders={props.toggleableHeaders}
                    shownHeaderKeys={props.shownHeaderKeys}
                    setShownHeaderKeys={props.setShownHeaderKeys}
                    headers={props.headers}
                    filters={props.additionalFilters}
                    setFilters={props.setAdditionalFilters}
                />
            )}
        </>
    );
};

export default TableFilterBar;
