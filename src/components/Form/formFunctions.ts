import React from "react";
import { booleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { Database } from "@/database_types_file";
import {
    changeEventHandler,
    selectChangeEventHandler,
} from "@/components/DataInput/inputHandlerFactories";

type Field = Fields[keyof Fields];
export type ErrorSetter = (errorKey: string, errorType: Errors) => void;
export type FieldSetter = (fieldKey: string, newFieldValue: Field) => void;
export type Gender = Database["public"]["Enums"]["gender"];

export enum Errors {
    initial = "required",
    none = "",
    required = "This is a required field.",
    invalid = "Please enter a valid entry.",
    submit = "Please ensure all fields have been entered correctly. Required fields are labelled with an asterisk.",
    external = "Please try again later.",
}

export const numberRegex = /^\d+$/;

export interface CardProps {
    formErrors: FormErrors;
    errorSetter: ErrorSetter;
    fieldSetter: FieldSetter;
    fields: Fields;
}

export interface Person {
    gender: Gender;
    age?: number | null;
    quantity?: number;
}

export interface Fields {
    [fieldKey: string]: any;
}

export interface FormErrors {
    [errorKey: string]: Errors;
}

export const setError = (
    errorSetter: React.Dispatch<React.SetStateAction<FormErrors>>,
    errorValues: FormErrors
): ErrorSetter => {
    return (errorKey, errorType) => {
        errorSetter({ ...errorValues, [errorKey]: errorType });
    };
};

export const setField = <SpecificFields extends Fields>(
    fieldSetter: React.Dispatch<React.SetStateAction<SpecificFields>>,
    fieldValues: SpecificFields
): FieldSetter => {
    return (fieldKey, newFieldValue) => {
        fieldSetter({ ...fieldValues, [fieldKey]: newFieldValue });
    };
};

const getErrorType = (
    input: string,
    required?: boolean,
    regex?: RegExp,
    additionalCondition?: (value: string) => boolean
): Errors => {
    if (required && input === "") {
        return Errors.required;
    }
    if (
        (regex !== undefined && !input.match(regex)) ||
        (additionalCondition !== undefined && !additionalCondition(input))
    ) {
        return Errors.invalid;
    }
    return Errors.none;
};

export const onChangeText = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    key: string,
    required?: boolean,
    regex?: RegExp,
    formattingFunction?: (value: string) => Field,
    additionalCondition?: (value: string) => boolean
): selectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        const errorType = getErrorType(input, required, regex, additionalCondition);
        errorSetter(key, errorType);
        if (errorType === Errors.none) {
            const newValue = formattingFunction ? formattingFunction(input) : input;
            fieldSetter(key, newValue);
        }
    };
};

export const onChangeCheckbox = (
    fieldSetter: FieldSetter,
    currentObject: booleanGroup,
    key: string
): changeEventHandler => {
    return (event) => {
        const newObject = { ...currentObject, [event.target.name]: event.target.checked };
        fieldSetter(key, newObject);
    };
};

export const onChangeRadioGroup = (
    fieldSetter: FieldSetter,
    key: string
): selectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter(key, input === "Yes");
    };
};

export const valueOnChangeRadioGroup = (
    fieldSetter: FieldSetter,
    key: string
): selectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter(key, input);
    };
};

export const onChangeDate = (fieldSetter: FieldSetter, key: string): selectChangeEventHandler => {
    return (event) => {
        console.log("reached onChangeDate");
        const input = String(event.target.value);
        console.log(input);
        fieldSetter(key, input);
    };
};

export const errorExists = (errorType: Errors): boolean => {
    return errorType !== Errors.initial && errorType !== Errors.none;
};

export const errorText = (errorType: Errors): string => {
    return errorType === Errors.initial ? Errors.none : errorType;
};

export const checkboxGroupToArray = (checkedBoxes: booleanGroup): string[] => {
    return Object.keys(checkedBoxes).filter((key) => checkedBoxes[key]);
};

export const checkErrorOnSubmit = (
    errorType: FormErrors,
    errorSetter: React.Dispatch<React.SetStateAction<FormErrors>>
): boolean => {
    let errorExists = false;
    let amendedErrorTypes = { ...errorType };
    for (const [errorKey, error] of Object.entries(errorType)) {
        if (error !== Errors.none) {
            errorExists = true;
        }
        if (error === Errors.initial) {
            amendedErrorTypes = {
                ...amendedErrorTypes,
                [errorKey]: Errors.required,
            };
        }
    }
    if (errorExists) {
        errorSetter(amendedErrorTypes);
    }
    return errorExists;
};
