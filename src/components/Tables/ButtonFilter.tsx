"use client";

import React from "react";
import { ClientSideFilter, ClientSideFilterMethod, defaultToString } from "./Filters";
import Button from "@mui/material/Button";
import { capitaliseWords } from "@/common/format";

interface ButtonGroupFilterProps<Data> {
    key: keyof Data;
    filterLabel: string;
    filterOptions: string[];
    initialActiveFilter: string;
    method: ClientSideFilterMethod<Data, string>;
    shouldPersistOnClear: boolean;
}

interface ButtonProps {
    activeFilter: string;
    buttonLabel: string;
    setState: (state: string) => void;
}

const FilterButton: React.FC<ButtonProps> = (buttonProps) => {
    const isActive = buttonProps.activeFilter === buttonProps.buttonLabel;
    return (
        <Button
            color="primary"
            variant={isActive ? "contained" : "outlined"}
            onClick={() => buttonProps.setState(buttonProps.buttonLabel)}
        >
            {capitaliseWords(buttonProps.buttonLabel)}
        </Button>
    );
};

export const buttonGroupFilter = <Data,>({
    key,
    filterLabel,
    filterOptions,
    initialActiveFilter,
    method,
    shouldPersistOnClear = false,
}: ButtonGroupFilterProps<Data>): ClientSideFilter<Data, string> => {
    return {
        key: key,
        state: initialActiveFilter,
        initialState: initialActiveFilter,
        method: method,
        areStatesIdentical: (stateA, stateB) => stateA === stateB,
        shouldPersistOnClear: shouldPersistOnClear,

        filterComponent: function (
            state: string,
            setState: (state: string) => void
        ): React.ReactNode {
            return (
                <>
                    {filterLabel}
                    {filterOptions.map((optionName) => (
                        <FilterButton
                            key={optionName}
                            activeFilter={state}
                            buttonLabel={optionName}
                            setState={setState}
                        />
                    ))}
                </>
            );
        },
    };
};

export const filterRowbyButton = <Data,>(row: Data, state: string, key: keyof Data): boolean => {
    return defaultToString(row[key]) === state;
};
