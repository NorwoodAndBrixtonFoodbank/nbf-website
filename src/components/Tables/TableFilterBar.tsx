"use client";

import React from "react";
import FilterAccordion from "@/components/Tables/FilterAccordion";
import Button from "@mui/material/Button";
import { TableHeaders } from "./Table";
import { Filter } from "./Filters";

interface Props<Data> {
    setFilters: (filters: Filter<Data, string>[]) => void;
    handleClear: () => void;
    headers: TableHeaders<Data>;
    filters: Filter<Data, string>[];
    toggleableHeaders: readonly (keyof Data)[];
    setShownHeaderKeys: (headers: (keyof Data)[]) => void;
    shownHeaderKeys: readonly (keyof Data)[];
}

const TableFilterBar = <Data extends unknown>(props: Props<Data>): React.ReactElement => {
    return (
        <>
            <Button variant="contained" onClick={props.handleClear}>
                Clear
            </Button>
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
            {props.toggleableHeaders.length !== 0 && (
                <FilterAccordion
                    toggleableHeaders={props.toggleableHeaders}
                    shownHeaderKeys={props.shownHeaderKeys}
                    setShownHeaderKeys={props.setShownHeaderKeys}
                    headers={props.headers}
                />
            )}
        </>
    );
};

export default TableFilterBar;
