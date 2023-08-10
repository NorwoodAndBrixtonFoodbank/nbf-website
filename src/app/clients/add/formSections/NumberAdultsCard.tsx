import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    CardProps,
    Errors,
    errorExists,
    ErrorSetter,
    errorText,
    FieldSetter,
    numberRegex,
    Person,
    Gender,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { selectChangeEventHandler } from "@/components/DataInput/inputHandlerFactories";
import { FormGap } from "@/components/Form/formStyling";

const getQuantity = (input: string): number => {
    if (input === "") {
        return 0;
    }
    if (input.match(numberRegex)) {
        return parseInt(input);
    }
    return -1;
};

const getNumberAdults = (
    fieldSetter: FieldSetter,
    errorSetter: ErrorSetter,
    adults: Person[],
    gender: Gender
): selectChangeEventHandler => {
    return (event) => {
        const input = event.target.value;
        const newValue = adults;
        const personIndex = newValue.findIndex((object) => object.gender === gender);

        newValue[personIndex].quantity = getQuantity(input);
        fieldSetter("adults", newValue);

        const invalidAdultEntry = newValue.filter((value) => value.quantity === -1);
        const nonZeroAdultEntry = newValue.filter((value) => value.quantity! > 0);

        let errorType: Errors = Errors.none;
        if (invalidAdultEntry.length > 0) {
            errorType = Errors.invalid;
        } else if (nonZeroAdultEntry.length === 0) {
            errorType = Errors.required;
        }

        errorSetter("adults", errorType);
    };
};

const NumberAdultsCard: React.FC<CardProps> = ({
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
            <>
                <FreeFormTextInput
                    error={errorExists(formErrors.adults)}
                    label="Female"
                    onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "female")}
                />
                <FormGap />
                <FreeFormTextInput
                    error={errorExists(formErrors.adults)}
                    label="Male"
                    onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "male")}
                />
                <FormGap />
                <FreeFormTextInput
                    error={errorExists(formErrors.adults)}
                    helperText={errorText(formErrors.adults)}
                    label="Prefer Not To Say"
                    onChange={getNumberAdults(fieldSetter, errorSetter, fields.adults, "other")}
                />
            </>
        </GenericFormCard>
    );
};

export default NumberAdultsCard;
