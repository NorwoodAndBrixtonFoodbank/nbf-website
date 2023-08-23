import React from "react";
import { SelectChangeEvent } from "@mui/material";

type ValueSetter = {
    (value: string): void;
};

type BooleanSetter = {
    (checked: boolean): void;
};

export type BooleanGroup = {
    [key: string]: boolean;
};

type BooleanGroupSetter = {
    (group: BooleanGroup): void;
};

export type ChangeEventHandler = {
    (event: React.ChangeEvent<HTMLInputElement>): void;
};

export type SelectChangeEventHandler = {
    (event: SelectChangeEvent): void;
};

const getValueChangeHandler = (setValue: ValueSetter): ChangeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
};

export const getFreeFormTextHandler = (setValue: ValueSetter): ChangeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getPasswordHandler = (setValue: ValueSetter): ChangeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getRadioGroupHandler = (setValue: ValueSetter): ChangeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getDropdownListHandler = (setValue: ValueSetter): SelectChangeEventHandler => {
    return (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };
};

export const getCheckboxHandler = (setBoolean: BooleanSetter): ChangeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setBoolean(event.target.checked);
    };
};

export const getCheckboxGroupHandler = (
    booleanGroup: BooleanGroup,
    setBooleanGroup: BooleanGroupSetter
): ChangeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setBooleanGroup({
            ...booleanGroup,
            [event.target.name]: event.target.checked,
        });
    };
};
