import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    Errors,
    errorExists,
    errorText,
    Setter,
    numberRegex,
    NumberAdultsByGender,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { SelectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { GappedDiv } from "@/components/Form/formStyling";
import { ClientCardProps, ClientErrors, ClientFields } from "../ClientForm";

const getNumberAdultsOfGenderDefault = (numberAdultsOfGender: number): string | undefined => {
    return numberAdultsOfGender === 0 ? undefined : numberAdultsOfGender.toString();
};

const getQuantity = (input: string): number => {
    if (input === "") {
        return 0;
    }
    if (input.match(numberRegex)) {
        return parseInt(input);
    }
    return -1;
};

const setNumberAdults = (
    fieldSetter: Setter<ClientFields>,
    errorSetter: Setter<ClientErrors>,
    adults: NumberAdultsByGender,
    fieldKey: keyof NumberAdultsByGender
): SelectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        const newAdults = { ...adults, [fieldKey]: getQuantity(input) };
        fieldSetter([["adults", newAdults]]);

        const invalidAdultEntry =
            newAdults.numberFemales < 0 ||
            newAdults.numberMales < 0 ||
            newAdults.numberUnknownGender < 0;
        const allAdultEntriesZero =
            newAdults.numberFemales === 0 &&
            newAdults.numberMales === 0 &&
            newAdults.numberUnknownGender === 0;

        let errorType: Errors = Errors.none;
        if (invalidAdultEntry) {
            errorType = Errors.invalid;
        } else if (allAdultEntriesZero) {
            errorType = Errors.required;
        }

        errorSetter([["adults", errorType]]);
    };
};

const NumberAdultsCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard
            title="Number of Adults"
            required={true}
            text="Please enter the number of adults (aged 16 or above) in the appropriate category."
        >
            <GappedDiv>
                <FreeFormTextInput
                    error={errorExists(formErrors.adults)}
                    label="Female"
                    defaultValue={getNumberAdultsOfGenderDefault(fields.adults.numberFemales)}
                    onChange={setNumberAdults(
                        fieldSetter,
                        errorSetter,
                        fields.adults,
                        "numberFemales"
                    )}
                />
                <FreeFormTextInput
                    error={errorExists(formErrors.adults)}
                    label="Male"
                    defaultValue={getNumberAdultsOfGenderDefault(fields.adults.numberMales)}
                    onChange={setNumberAdults(
                        fieldSetter,
                        errorSetter,
                        fields.adults,
                        "numberMales"
                    )}
                />
                <FreeFormTextInput
                    error={errorExists(formErrors.adults)}
                    helperText={errorText(formErrors.adults)}
                    label="Prefer Not To Say"
                    defaultValue={getNumberAdultsOfGenderDefault(fields.adults.numberUnknownGender)}
                    onChange={setNumberAdults(
                        fieldSetter,
                        errorSetter,
                        fields.adults,
                        "numberUnknownGender"
                    )}
                />
            </GappedDiv>
        </GenericFormCard>
    );
};

export default NumberAdultsCard;
