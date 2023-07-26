import React from "react";
import { Database } from "@/database_types_file";
import { booleanGroup } from "@/components/DataInput/inputHandlerFactories";
import { SelectChangeEvent } from "@mui/material";
import { InsertSchema } from "@/supabase";
import supabase from "@/supabase";

type PersonType = Database["public"]["Enums"]["gender"];
type FieldType = string | (boolean | null) | booleanGroup | Address | People[];
type EventType = React.ChangeEvent<HTMLInputElement> | SelectChangeEvent;
type OnChangeType = (event: EventType) => void;
type SetErrorType = (errorKey: string, errorMessage: string) => void;
type SetFieldType = (fieldKey: string, newFieldValue: FieldType) => void;
export type ClientDatabaseRecord = InsertSchema["clients"];
type FamilyDatabaseRecord = InsertSchema["families"];

interface Address {
    line1: string;
    line2: string;
    town: string;
    county: string;
    postcode: string;
}

export interface People {
    personType: PersonType;
    age?: number | null;
    quantity?: number;
}

export interface ErrorMessages {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressPostcode: string;
    adults: string;
    numberChildren: string;
    nappyErrorMessage: string;
}

export interface Fields {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressTown: string;
    addressCounty: string;
    addressPostcode: string;
    adults: People[];
    numberChildren: number;
    children: People[];
    dietaryRequirements: booleanGroup;
    feminineProducts: booleanGroup;
    babyProducts: boolean | null;
    nappySize: string;
    petFood: booleanGroup;
    otherItems: booleanGroup;
    deliveryInstructions: string;
    extraInformation: string;
}

export const setErrorFunction = (
    errorSetter: React.Dispatch<React.SetStateAction<ErrorMessages>>,
    errorValues: ErrorMessages
): SetErrorType => {
    return (errorKey, errorMessage): void => {
        errorSetter({ ...errorValues, [errorKey]: errorMessage });
    };
};

export const setFieldFunction = (
    fieldSetter: React.Dispatch<React.SetStateAction<Fields>>,
    fieldValues: Fields
): SetFieldType => {
    return (fieldKey, newFieldValue) => {
        fieldSetter({ ...fieldValues, [fieldKey]: newFieldValue });
    };
};
const getErrorType = (event: EventType, required?: boolean, regex?: RegExp): string => {
    const input = event.target.value;
    if (required && input === "") {
        return "This is a required fields.";
    } else if (!!regex && !input.match(regex)) {
        return "Please enter a valid entry.";
    } else {
        return "";
    }
};

export const checkboxGroupToArray = (checkedBoxes: booleanGroup): string[] => {
    return Object.keys(checkedBoxes).filter((key) => checkedBoxes[key]);
};

export const onChangeFunction = (
    fieldSetter: SetFieldType,
    errorSetter: SetErrorType,
    key: string,
    required?: boolean,
    regex?: RegExp,
    formattingFunction?: (value: any) => any
): OnChangeType => {
    return (event) => {
        const errorType = getErrorType(event, required, regex);
        errorSetter(key, errorType);
        if (errorType === "") {
            const newValue = formattingFunction && formattingFunction(event.target.value);
            fieldSetter(key, newValue);
        }
    };
};

export const onChangeCheckbox = (
    fieldSetter: SetFieldType,
    currentObject: booleanGroup,
    key: string
): OnChangeType => {
    return (event) => {
        const newObject = { ...currentObject, [event.target.name]: event.target.checked };
        fieldSetter(key, newObject);
    };
};

export const errorExists = (errorMessage: string): boolean => {
    return errorMessage !== "" && errorMessage !== "N/A";
};

export const errorText = (errorMessage: string): string => {
    return errorMessage == "N/A" ? "" : errorMessage;
};

export const phoneNumberRegex = /^([+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6})?$/;
export const formatPhoneNumber = (value: string): string => {
    const numericInput = value.replace(/(\D)/g, "");
    return numericInput[0] === "0" ? "+44" + numericInput.slice(1) : "+" + numericInput;
};
export const postcodeRegex =
    /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/;
export const formatPostcode = (value: string): string => {
    return value.replace(/(\s)/g, "").toUpperCase();
};
export const numberRegex = /^\d+$/;

export const getNumberAdults = (
    fieldSetter: SetFieldType,
    errorSetter: SetErrorType,
    adults: People[],
    personType: PersonType
): OnChangeType => {
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
        let newMessage = "";
        if (invalidAdultEntry.length > 0) {
            newMessage = "Please enter a valid entry.";
        } else if (nonZeroAdultEntry.length === 0) {
            newMessage = "This is a required field.";
        }
        errorSetter("adults", newMessage);
    };
};

export const getChild = (
    fieldSetter: SetFieldType,
    children: People[],
    index: number,
    subFieldName: "personType" | "age"
): OnChangeType => {
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

export const getBaby = (fieldSetter: SetFieldType, errorSetter: SetErrorType): OnChangeType => {
    return (event) => {
        const input = event.target.value;
        if (input === "Yes") {
            errorSetter("babyProducts", "N/A");
            fieldSetter("babyProducts", true);
        } else {
            errorSetter("babyProducts", "");
            if (input === "No") {
                fieldSetter("babyProducts", false);
            } else {
                fieldSetter("babyProducts", null);
            }
        }
    };
};

export const checkErrorOnSubmit = (
    errorMessages: ErrorMessages,
    errorSetter: React.Dispatch<React.SetStateAction<ErrorMessages>>
): boolean => {
    let errorExists = false;
    let amendedErrorMessages = { ...errorMessages };
    for (const [errorKey, errorMessage] of Object.entries(errorMessages)) {
        if (errorMessage !== "") {
            errorExists = true;
        }
        if (errorMessage === "N/A") {
            amendedErrorMessages = {
                ...amendedErrorMessages,
                [errorKey]: "This is a required field.",
            };
        }
    }
    if (errorExists) {
        errorSetter({ ...amendedErrorMessages });
    }
    return errorExists;
};

export const insertFamily = async (peopleArray: People[], familyID: string): Promise<boolean> => {
    const familyRecords = peopleArray.map((person): FamilyDatabaseRecord => {
        return {
            family_id: familyID,
            person_type: person.personType,
            quantity: person.quantity ?? 1,
            age: person.age ?? null,
        };
    });

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
