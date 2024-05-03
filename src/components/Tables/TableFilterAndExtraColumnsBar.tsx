"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import { TableHeaders } from "@/components/Tables/Table";
import styled from "styled-components";
import { FilterAltOffOutlined, FilterAltOutlined } from "@mui/icons-material";
import ColumnTogglePopup from "@/components/Tables/ColumnTogglePopup";
import { CoreFilter } from "./Filters";

interface Props<Data, Filter extends CoreFilter> {
    setFilters?: (filters: Filter[]) => void;
    setAdditionalFilters?: (filters: Filter[]) => void;
    headers: TableHeaders<Data>;
    filters?: Filter[];
    additionalFilters?: Filter[];
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

export const filtersToComponents = <Filter extends CoreFilter>(
    filters: Filter[],
    setFilters: (filters: Filter[]) => void
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

const TableFilterAndExtraColumnsBar = <Data, Filter extends CoreFilter>(
    props: Props<Data, Filter>
): React.ReactElement => {
    const handleClear = (): void => {
        props.setFilters &&
            props.filters &&
            props.setFilters(
                props.filters?.map((filter) => ({
                    ...filter,
                    state: filter.initialState,
                }))
            );
        props.setAdditionalFilters &&
            props.additionalFilters &&
            props.setAdditionalFilters(
                props.additionalFilters?.map((filter) => ({
                    ...filter,
                    state: filter.initialState,
                }))
            );
    };

    const [showMoreFiltersAndHeaders, setShowMoreFiltersAndHeaders] = useState(false);

    const hasPrimaryFilters = props.filters && props.filters?.length !== 0 && props.setFilters;

    const hasAdditionalFilters =
        props.additionalFilters &&
        props.additionalFilters?.length !== 0 &&
        props.setAdditionalFilters;

    const hasToggleableHeaders = props.toggleableHeaders.length !== 0;

    const handleToggleAdditional = (): void => {
        setShowMoreFiltersAndHeaders((prev) => !prev);
    };

    if (!hasPrimaryFilters && !hasAdditionalFilters && !hasToggleableHeaders) {
        return <></>;
    }

    return (
        <>
            <FiltersAndIconContainer>
                {hasPrimaryFilters && <FilterAltOutlined />}
                <FilterContainer>
                    <>
                        {props.filters &&
                            props.filters?.length !== 0 &&
                            props.setFilters &&
                            filtersToComponents(props.filters, props.setFilters)}
                        <Grow />
                        {(hasAdditionalFilters || hasToggleableHeaders) && (
                            <StyledButton
                                variant="outlined"
                                onClick={handleToggleAdditional}
                                color="inherit"
                                startIcon={<FilterAltOutlined />}
                            >
                                {showMoreFiltersAndHeaders ? "Less" : "More"}
                            </StyledButton>
                        )}
                        {(hasPrimaryFilters || hasAdditionalFilters) && (
                            <StyledButton
                                variant="outlined"
                                onClick={handleClear}
                                color="inherit"
                                startIcon={<FilterAltOffOutlined />}
                            >
                                Clear
                            </StyledButton>
                        )}
                    </>
                </FilterContainer>
            </FiltersAndIconContainer>
            {(hasAdditionalFilters || hasToggleableHeaders) && showMoreFiltersAndHeaders && (
                <>
                    <FiltersAndIconContainer>
                        {hasAdditionalFilters && <FilterAltOutlined />}
                        <FilterContainer>
                            {props.additionalFilters &&
                                props.additionalFilters?.length !== 0 &&
                                props.setAdditionalFilters && (
                                    <>
                                        {filtersToComponents(
                                            props.additionalFilters,
                                            props.setAdditionalFilters
                                        )}
                                    </>
                                )}
                            <Grow />
                            {props.toggleableHeaders.length > 0 && (
                                <ColumnTogglePopup
                                    toggleableHeaders={props.toggleableHeaders}
                                    shownHeaderKeys={props.shownHeaderKeys}
                                    setShownHeaderKeys={props.setShownHeaderKeys}
                                    headers={props.headers}
                                />
                            )}
                        </FilterContainer>
                    </FiltersAndIconContainer>
                </>
            )}
        </>
    );
};

export default TableFilterAndExtraColumnsBar;
