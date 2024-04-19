import {
    BooleanGroup,
    ChangeEventHandler,
    SelectChangeEventHandler,
} from "@/components/DataInput/inputHandlerFactories";
import { Database } from "@/databaseTypesFile";
import dayjs, { Dayjs } from "dayjs";

type Field = Fields[keyof Fields];
export type ErrorSetter = (errorKey: string, errorType: Errors) => void;
export type FieldSetter = (keyValuePairs: [string, Field][]) => void;
export type Gender = Database["public"]["Enums"]["gender"];

export enum Errors {
    initial = "required",
    none = "",
    required = "This is a required field.",
    invalid = "Please enter a valid entry.",
    submit = "Please ensure all fields have been entered correctly. Required fields are labelled with an asterisk.",
    external = "Please try again later.",
    pastDate = "Please enter a date in the future.",
    invalidPackingSlot = "The previous packing slot is no longer available, please select a new packing slot.",
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
    primaryKey?: string;
}

export interface NumberAdultsByGender {
    numberFemales: number;
    numberMales: number;
    numberUnknownGender: number;
}

export interface Fields {
    [fieldKey: string]: any;
}

export interface FormErrors {
    [errorKey: string]: Errors;
}

export const createErrorSetter = (
    setErrors: (errors: FormErrors) => void,
    errorValues: FormErrors
): ErrorSetter => {
    return (errorKey, errorType) => {
        setErrors({ ...errorValues, [errorKey]: errorType });
    };
};

export const createFieldSetter = <  Fields>(
    setFields: (fieldValues: Fields) => void,
    fieldValues: Fields
): FieldSetter => {
    return (keyValuePairs: [string, any][]) => {
        let newFieldValues: Fields = {...fieldValues};
        keyValuePairs.forEach((keyValuePair) => {newFieldValues[keyValuePair[0]] = keyValuePairs[1]});
        setFields(newFieldValues);
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
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        const errorType = getErrorType(input, required, regex, additionalCondition);
        errorSetter(key, errorType);
        if (errorType === Errors.none) {
            const newValue = formattingFunction ? formattingFunction(input) : input;
            fieldSetter([[key, newValue]]);
        }
    };
};

export const onChangeCheckbox = (
    fieldSetter: FieldSetter,
    currentObject: BooleanGroup,
    key: string
): ChangeEventHandler => {
    return (event) => {
        const newObject = { ...currentObject, [event.target.name]: event.target.checked };
        fieldSetter([[key, newObject]]);
    };
};

export const onChangeRadioGroup = (
    fieldSetter: FieldSetter,
    key: string
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter([[key, input === "Yes"]]);
    };
};

export const valueOnChangeRadioGroup = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    key: string
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter([[key, input]]);
        errorSetter(key, Errors.none);
    };
};

export const valueOnChangeDropdownList = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    key: string
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter([[key, input]]);
        errorSetter(key, Errors.none);
    };
};

export const onChangeDateOrTime = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    key: string,
    value: Dayjs | null
): void => {
    if (value === null || isNaN(Date.parse(value.toString()))) {
        fieldSetter([[key, null]]);
        errorSetter(key, Errors.invalid);
        return;
    }
    errorSetter(key, Errors.none);
    fieldSetter([[key, value]]);
};

export const onChangeDate = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    key: string,
    value: Dayjs | null
): void => {
    onChangeDateOrTime(fieldSetter, errorSetter, key, value);
    if (value === null || isNaN(Date.parse(value.toString()))) {
        return;
    }

    const earliestPossibleDateTime = dayjs().startOf("day");
    if (value.isBefore(earliestPossibleDateTime)) {
        errorSetter(key, Errors.pastDate);
    }
};

export const errorExists = (errorType: Errors): boolean => {
    return errorType !== Errors.initial && errorType !== Errors.none;
};

export const errorText = (errorType: Errors): string => {
    return errorType === Errors.initial ? Errors.none : errorType;
};

export const checkboxGroupToArray = (checkedBoxes: BooleanGroup): string[] => {
    return Object.keys(checkedBoxes).filter((key) => checkedBoxes[key]);
};

export const checkErrorOnSubmit = (
    errorType: FormErrors,
    errorSetter: (errors: FormErrors) => void,
    keysToCheck?: string[]
): boolean => {
    let errorExists = false;
    let amendedErrorTypes = { ...errorType };
    for (const [errorKey, error] of Object.entries(errorType)) {
        if (!keysToCheck || keysToCheck.includes(errorKey)) {
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
    }
    if (errorExists) {
        errorSetter(amendedErrorTypes);
    }
    return errorExists;
};

export const getDefaultTextValue = (fields: Fields, fieldKey: keyof Fields): string | undefined => {
    return fields[fieldKey].length === 0 ? undefined : fields[fieldKey];
};
