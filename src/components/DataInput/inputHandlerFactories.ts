import React from "react";
import { SelectChangeEvent } from "@mui/material";

type ValueSetter<Value> = (value: Value) => void;

export type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

export type SelectChangeEventHandler<Value = string> = (event: SelectChangeEvent<Value>) => void;

export interface BooleanGroup {
    [key: string]: boolean;
}

const getValueChangeHandler = (setValue: ValueSetter<string>): ChangeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
};

export const getFreeFormTextHandler = (setValue: ValueSetter<string>): ChangeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getRadioGroupHandler = (setValue: ValueSetter<string>): ChangeEventHandler => {
    return getValueChangeHandler(setValue);
};

export const getDropdownListHandler = <Value = string>(
    setValue: ValueSetter<Value>,
    isValueValid: (value: string | Value) => value is Value
): SelectChangeEventHandler<Value> => {
    return (event: SelectChangeEvent<Value>) => {
        const value = event.target.value;
        if (isValueValid(value)) {
            setValue(value);
        }
    };
};

export const getCheckboxHandler = (setBoolean: ValueSetter<boolean>): ChangeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setBoolean(event.target.checked);
    };
};

export const getCheckboxGroupHandler = (
    booleanGroup: BooleanGroup,
    setBooleanGroup: ValueSetter<BooleanGroup>
): ChangeEventHandler => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setBooleanGroup({
            ...booleanGroup,
            [event.target.name]: event.target.checked,
        });
    };
};
