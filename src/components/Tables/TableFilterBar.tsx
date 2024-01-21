"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import { TableHeaders } from "@/components/Tables/Table";
import { Filter } from "@/components/Tables/Filters";
import styled from "styled-components";
import { FilterAltOffOutlined, FilterAltOutlined } from "@mui/icons-material";
import ColumnTogglePopup from "@/components/Tables/ColumnTogglePopup";

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

const FiltersAndIconContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: transparent;
    padding: 0;
`;

const FilterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.5rem 0;
    gap: 1rem;
    overflow: visible;
    width: 100%;
`;

const Grow = styled.div`
    flex-grow: 1;
`;

export const filtersToComponents = <Data,>(
    filters: Filter<Data, any>[],
    setFilters: (filters: Filter<Data, any>[]) => void
): React.ReactElement[] => {
    return filters.map((filter, index) => {
        const onFilter = (state: any): void => {
            const newFilters = [...filters];
            newFilters[index] = {
                ...newFilters[index],
                state,
            };
            setFilters(newFilters);
        };
        return filter.filterComponent(filter.state, onFilter);
    });
};

const TableFilterBar = <Data,>(props: Props<Data>): React.ReactElement => {
    const [showAdditional, setShowAdditional] = useState(false);

    const hasAdditional =
        props.additionalFilters.length !== 0 || props.toggleableHeaders.length !== 0;

    const handleToggleAdditional = (): void => {
        setShowAdditional(!showAdditional);
    };

    if (props.filters.length === 0 && !hasAdditional) {
        return <></>;
    }

    return (
        <>
            <FiltersAndIconContainer>
                <FilterAltOutlined />
                <FilterContainer>
                    {props.filters.length > 0 && (
                        <>
                            {filtersToComponents(props.filters, props.setFilters)}
                            <Grow />
                            <StyledButton
                                variant="outlined"
                                onClick={handleToggleAdditional}
                                color="inherit"
                                startIcon={<FilterAltOutlined />}
                            >
                                {showAdditional ? "Less" : "More"}
                            </StyledButton>
                            <StyledButton
                                variant="outlined"
                                onClick={props.handleClear}
                                color="inherit"
                                startIcon={<FilterAltOffOutlined />}
                            >
                                Clear
                            </StyledButton>
                        </>
                    )}
                </FilterContainer>
            </FiltersAndIconContainer>
            {hasAdditional && showAdditional && (
                <>
                    <FiltersAndIconContainer>
                        <FilterAltOutlined />
                        <FilterContainer>
                            {props.additionalFilters.length > 0 && (
                                <>
                                    {filtersToComponents(
                                        props.additionalFilters,
                                        props.setAdditionalFilters
                                    )}
                                </>
                            )}
                            <Grow />
                            <ColumnTogglePopup
                                toggleableHeaders={props.toggleableHeaders}
                                shownHeaderKeys={props.shownHeaderKeys}
                                setShownHeaderKeys={props.setShownHeaderKeys}
                                headers={props.headers}
                            />
                        </FilterContainer>
                    </FiltersAndIconContainer>
                </>
            )}
        </>
    );
};

export default TableFilterBar;
