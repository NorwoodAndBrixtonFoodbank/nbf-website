import {
    BooleanGroup,
    ChangeEventHandler,
    SelectChangeEventHandler,
} from "@/components/DataInput/inputHandlerFactories";
import { Database } from "@/databaseTypesFile";
import dayjs, { Dayjs } from "dayjs";

export type Setter<SpecificFields extends Fields> = (
    fieldValuesToUpdate: Partial<SpecificFields>
) => void;
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
    invalidCollectionCentre = "The previous collection centre is no longer available, please select a new collection centre.",
    noCollectionSlotsSet = "There are no collection slots set for this collection centre, please select a different collection centre or contact admin.",
}

export const numberRegex = /^\d+$/;

export interface CardProps<
    SpecificFields extends Fields,
    SpecificErrors extends FormErrors<SpecificFields>,
> {
    formErrors: SpecificErrors;
    errorSetter: Setter<SpecificErrors>;
    fieldSetter: Setter<SpecificFields>;
    fields: SpecificFields;
}

export interface Person {
    gender: Gender;
    birthYear: number;
    birthMonth?: number | null;
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

export type FormErrors<SpecificFields extends Fields> = {
    [errorKey in keyof SpecificFields]?: Errors;
};

export const createSetter = <SpecificFields extends Fields>(
    setFields: (SpecificFields: SpecificFields) => void,
    fieldValues: SpecificFields
): Setter<SpecificFields> => {
    return (fieldValuesToUpdate: Partial<SpecificFields>): void => {
        setFields({ ...fieldValues, ...fieldValuesToUpdate });
    };
};

const getErrorType = (
    input: string,
    required?: boolean,
    regex?: RegExp,
    additionalCondition?: (value: string) => boolean
): Errors => {
    if (input == "") {
        return required ? Errors.required : Errors.none;
    }

    if (
        (regex !== undefined && !input.match(regex)) ||
        (additionalCondition !== undefined && !additionalCondition(input))
    ) {
        return Errors.invalid;
    }

    return Errors.none;
};

export const onChangeText = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    errorSetter: Setter<FormErrors<SpecificFields>> | Setter<Required<FormErrors<SpecificFields>>>,
    key: keyof SpecificFields,
    required?: boolean,
    regex?: RegExp,
    formattingFunction?: (value: string) => SpecificFields[keyof SpecificFields],
    additionalCondition?: (value: string) => boolean
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        const errorType = getErrorType(input, required, regex, additionalCondition);
        errorSetter({ [key]: errorType } as { [key in keyof FormErrors<SpecificFields>]: Errors });
        if (errorType === Errors.none) {
            const newValue = formattingFunction ? formattingFunction(input) : input;
            fieldSetter({ [key]: newValue } as { [key in keyof SpecificFields]: any });
        }
    };
};

export const onChangeCheckbox = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    currentObject: BooleanGroup,
    key: string
): ChangeEventHandler => {
    return (event) => {
        const newObject = { ...currentObject, [event.target.name]: event.target.checked };
        fieldSetter({ [key]: newObject } as { [key in keyof SpecificFields]: any });
    };
};

export const onChangeRadioGroup = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    key: string
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter({ [key]: input === "Yes" } as { [key in keyof SpecificFields]: any });
    };
};

export const valueOnChangeRadioGroup = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    errorSetter: Setter<FormErrors<SpecificFields>> | Setter<Required<FormErrors<SpecificFields>>>,
    key: string
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter({ [key]: input } as { [key in keyof SpecificFields]: any });
        errorSetter({ [key]: Errors.none } as {
            [key in keyof FormErrors<SpecificFields>]: Errors;
        });
    };
};

export const valueOnChangeDropdownList = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    errorSetter: Setter<FormErrors<SpecificFields>> | Setter<Required<FormErrors<SpecificFields>>>,
    key: string
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        fieldSetter({ [key]: input } as { [key in keyof SpecificFields]: any });
        errorSetter({ [key]: Errors.none } as {
            [key in keyof FormErrors<SpecificFields>]: Errors;
        });
    };
};

export const onChangeDateOrTime = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    errorSetter: Setter<FormErrors<SpecificFields>> | Setter<Required<FormErrors<SpecificFields>>>,
    key: string,
    value: Dayjs | null
): void => {
    if (value === null || isNaN(Date.parse(value.toString()))) {
        fieldSetter({ [key]: null } as { [key in keyof SpecificFields]: any });
        errorSetter({ [key]: Errors.invalid } as {
            [key in keyof FormErrors<SpecificFields>]: Errors;
        });
        return;
    }
    fieldSetter({ [key]: value } as { [key in keyof SpecificFields]: any });
    errorSetter({ [key]: Errors.none } as { [key in keyof FormErrors<SpecificFields>]: Errors });
};

export const onChangeDate = <SpecificFields extends Fields>(
    fieldSetter: Setter<SpecificFields>,
    errorSetter: Setter<FormErrors<SpecificFields>> | Setter<Required<FormErrors<SpecificFields>>>,
    key: string,
    value: Dayjs | null
): void => {
    onChangeDateOrTime(fieldSetter, errorSetter, key, value);
    if (value === null || isNaN(Date.parse(value.toString()))) {
        return;
    }

    const earliestPossibleDateTime = dayjs().startOf("day");
    if (value.isBefore(earliestPossibleDateTime)) {
        errorSetter({ [key]: Errors.pastDate } as {
            [key in keyof FormErrors<SpecificFields>]: Errors;
        });
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

export const checkErrorOnSubmit = <
    SpecificFields extends Fields,
    SpecificErrors extends FormErrors<SpecificFields>,
>(
    errorType: SpecificErrors,
    errorSetter: (errors: SpecificErrors) => void,
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
    return fields[fieldKey] ?? undefined;
};
