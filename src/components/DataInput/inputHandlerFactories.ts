import React from "react";
import { SelectChangeEvent } from "@mui/material";

type valueSetter = {
    (value: string): void;
};

type booleanSetter = {
    (checked: boolean): void;
};

export type booleanGroup = {
    [key: string]: boolean;
};

type booleanGroupSetter = {
    (group: booleanGroup): void;
};

export type changeEventHandler = {
    (event: React.ChangeEvent<HTMLInputElement>): void;
};

export type selectChangeEventHandler = {
    (event: SelectChangeEvent): void;
};

const getValueChangeHandler = (setValue: valueSetter): changeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
};

export const getFreeFormTextHandler = (setValue: valueSetter): changeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getPasswordHandler = (setValue: valueSetter): changeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getRadioGroupHandler = (setValue: valueSetter): changeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getDropdownListHandler = (setValue: valueSetter): selectChangeEventHandler => {
    return (event: SelectChangeEvent) => {
        setValue(event.target.value);
    };
};

export const getCheckboxHandler = (setBoolean: booleanSetter): changeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setBoolean(event.target.checked);
    };
};

export const getCheckboxGroupHandler = (
    booleanGroup: booleanGroup,
    setBooleanGroup: booleanGroupSetter
): changeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setBooleanGroup({
            ...booleanGroup,
            [event.target.name]: event.target.checked,
        });
    };
};
