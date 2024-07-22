"use client";

import React from "react";
import { ClientSideFilter, ClientSideFilterMethod } from "./Filters";
import Button from "@mui/material/Button";

interface ButtonGroupFilterProps<Data> {
    key: keyof Data;
    filterLabel: string;
    filterOptions: string[];
    initialActiveFilter: string;
    method: ClientSideFilterMethod<Data, string>;
}

interface ButtonProps {
    activeFilter: string;
    buttonLabel: string;
    setState: (state: string) => void;
}

const FilterButton: React.FC<ButtonProps> = (buttonProps) => {
    const active = buttonProps.activeFilter === buttonProps.buttonLabel;
    return (
        <Button
            color="primary"
            variant={active ? "contained" : "outlined"}
            onClick={() => buttonProps.setState(buttonProps.buttonLabel)}
        >
            {buttonProps.buttonLabel}
        </Button>
    );
};

export const buttonGroupFilter = <Data,>({
    key,
    filterLabel,
    filterOptions,
    initialActiveFilter,
    method,
}: ButtonGroupFilterProps<Data>): ClientSideFilter<Data, string> => {
    return {
        key: key,
        state: initialActiveFilter,
        initialState: initialActiveFilter,
        method: method,
        areStatesIdentical: (stateA, stateB) => stateA === stateB,

        filterComponent: function (
            state: string,
            setState: (state: string) => void
        ): React.ReactNode {
            // const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            //     setState();
            // }

            return (
                <>
                    {console.log("button re-rerender")}
                    {console.log(state)}
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
    return row[key] === state;
};
