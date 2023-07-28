import React from "react";
import { SelectChangeEvent } from "@mui/material";
import { booleanGroup } from "@/components/DataInput/inputHandlerFactories";
import supabase, { InsertSchema } from "@/supabase";
import { Database } from "@/database_types_file";

type Field = string | number | boolean | null | booleanGroup | Address | Person[];
type OnChange = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => void;
type OnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => void;
type ErrorSetter = (errorKey: string, errorType: Error) => void;
type FieldSetter = (fieldKey: string, newFieldValue: Field) => void;
type PersonType = Database["public"]["Enums"]["gender"];
type FamilyDatabaseRecord = InsertSchema["families"];
export type ClientDatabaseRecord = InsertSchema["clients"];
export enum Error {
    initial = "required",
    none = "",
    required = "This is a required field.",
    invalid = "Please enter a valid entry.",
    submit = "Please ensure all fields have been entered correctly. Required fields are labelled with an asterisk.",
    database = "An error has occurred. Please try again later.",
}

export const phoneNumberRegex = /^([+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6})?$/;
// Regex source: https://ihateregex.io/expr/phone/

export const postcodeRegex =
    /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
// Regex source: https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/488478/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf

export const numberRegex = /^\d+$/;

interface Address {
    line1: string;
    line2: string;
    town: string;
    county: string;
    postcode: string;
}

export interface Person {
    personType: PersonType;
    age?: number | null;
    quantity?: number;
}

export interface FormErrors {
    fullName: Error;
    phoneNumber: Error;
    addressLine1: Error;
    addressPostcode: Error;
    adults: Error;
    numberChildren: Error;
    nappySize: Error;
}

export interface Fields {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressTown: string;
    addressCounty: string;
    addressPostcode: string;
    adults: Person[];
    numberChildren: number;
    children: Person[];
    dietaryRequirements: booleanGroup;
    feminineProducts: booleanGroup;
    babyProducts: boolean | null;
    nappySize: string;
    petFood: booleanGroup;
    otherItems: booleanGroup;
    deliveryInstructions: string;
    extraInformation: string;
}

export const setError = (
    errorSetter: React.Dispatch<React.SetStateAction<FormErrors>>,
    errorValues: FormErrors
): ErrorSetter => {
    return (errorKey, errorType) => {
        errorSetter({ ...errorValues, [errorKey]: errorType });
    };
};

export const setField = (
    fieldSetter: React.Dispatch<React.SetStateAction<Fields>>,
    fieldValues: Fields
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
): Error => {
    if (required && input === "") {
        return Error.required;
    } else if (
        (!!regex && !input.match(regex)) ||
        (!!additionalCondition && !additionalCondition(input))
    ) {
        return Error.invalid;
    } else {
        return Error.none;
    }
};

export const getOnChange = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    key: string,
    required?: boolean,
    regex?: RegExp,
    formattingFunction?: (value: string) => Field,
    additionalCondition?: (value: string) => boolean
): OnChange => {
    return (event) => {
        const input = event.target.value;
        const errorType = getErrorType(input, required, regex, additionalCondition);
        errorSetter(key, errorType);
        if (errorType === Error.none) {
            const newValue = formattingFunction ? formattingFunction(input) : input;
            fieldSetter(key, newValue);
        }
    };
};

export const onChangeCheckbox = (
    fieldSetter: FieldSetter,
    currentObject: booleanGroup,
    key: string
): OnChangeCheckbox => {
    return (event) => {
        const newObject = { ...currentObject, [event.target.name]: event.target.checked };
        fieldSetter(key, newObject);
    };
};

export const getNumberAdults = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    adults: Person[],
    personType: PersonType
): OnChange => {
    return (event) => {
        const input = event.target.value;
        const numberPattern = /^\d+$/;
        const newValue = adults;
        const personIndex = newValue.findIndex((object) => object.personType === personType);
        if (input === "") {
            newValue[personIndex].quantity = 0;
        } else if (input.match(numberPattern)) {
            newValue[personIndex].quantity = parseInt(input);
        } else {
            newValue[personIndex].quantity = -1;
        }
        fieldSetter("adults", newValue);

        const invalidAdultEntry = newValue.filter((value) => value.quantity === -1);
        const nonZeroAdultEntry = newValue.filter((value) => value.quantity! > 0);
        let errorType: Error = Error.none;
        if (invalidAdultEntry.length > 0) {
            errorType = Error.invalid;
        } else if (nonZeroAdultEntry.length === 0) {
            errorType = Error.required;
        }
        errorSetter("adults", errorType);
    };
};

export const getChild = (
    fieldSetter: FieldSetter,
    children: Person[],
    index: number,
    subFieldName: "personType" | "age"
): OnChange => {
    return (event) => {
        const input = event.target.value;
        if (subFieldName === "personType") {
            children[index][subFieldName] = (
                input !== "don't know" ? input : "child"
            ) as PersonType;
        } else {
            children[index][subFieldName] = input !== "don't know" ? parseInt(input) : null;
        }
        fieldSetter("children", [...children]);
    };
};

export const getBaby = (fieldSetter: FieldSetter, errorSetter: ErrorSetter): OnChange => {
    return (event) => {
        const input = event.target.value;
        if (input === "Yes") {
            errorSetter("nappySize", Error.initial);
            fieldSetter("babyProducts", true);
        } else {
            errorSetter("nappySize", Error.none);
            if (input === "No") {
                fieldSetter("babyProducts", false);
            } else {
                fieldSetter("babyProducts", null);
            }
        }
    };
};

export const errorExists = (errorType: Error): boolean => {
    return errorType !== Error.initial && errorType !== Error.none;
};

export const errorText = (errorType: Error): string => {
    return errorType === Error.initial ? Error.none : errorType;
};

export const checkboxGroupToArray = (checkedBoxes: booleanGroup): string[] => {
    return Object.keys(checkedBoxes).filter((key) => checkedBoxes[key]);
};

export const formatPhoneNumber = (value: string): string => {
    const numericInput = value.replace(/(\D)/g, "");
    return numericInput[0] === "0" ? "+44" + numericInput.slice(1) : "+" + numericInput;
};

export const formatPostcode = (value: string): string => {
    return value.replace(/(\s)/g, "").toUpperCase();
};

export const maxNumberChildren = (value: string): boolean => {
    return parseInt(value) <= 20;
};

export const checkErrorOnSubmit = (
    errorType: FormErrors,
    errorSetter: React.Dispatch<React.SetStateAction<FormErrors>>
): boolean => {
    let errorExists = false;
    let amendedErrorTypes = { ...errorType };
    for (const [errorKey, error] of Object.entries(errorType)) {
        if (error !== "none") {
            errorExists = true;
        }
        if (error === "initial") {
            amendedErrorTypes = {
                ...amendedErrorTypes,
                [errorKey]: "required",
            };
        }
    }
    if (errorExists) {
        errorSetter({ ...amendedErrorTypes });
    }
    return errorExists;
};

export const insertFamily = async (
    peopleArray: Person[],
    familyID: string | null
): Promise<boolean> => {
    if (familyID === null) {
        return false;
    }
    const familyRecords: FamilyDatabaseRecord[] = [];
    for (const person of peopleArray) {
        if (person.quantity === undefined || person.quantity > 0) {
            familyRecords.push({
                family_id: familyID,
                person_type: person.personType,
                quantity: person.quantity ?? 1,
                age: person.age ?? null,
            });
        }
    }
    const { error: error } = await supabase.from("families").insert(familyRecords);
    return error === null;
};

export const insertClient = async (clientRecord: ClientDatabaseRecord): Promise<string | null> => {
    const { data: familyID, error: error } = await supabase
        .from("clients")
        .insert(clientRecord)
        .select("family_id");
    return error === null ? familyID![0].family_id : null;
};
