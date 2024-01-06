import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    CardProps,
    errorExists,
    errorText,
    getDefaultTextValue,
    onChangeText,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";

const phoneNumberRegex = /^([+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6})?$/;
// Regex source: https://ihateregex.io/expr/phone/

const formatPhoneNumber = (value: string): string => {
    const numericInput = value.replace(/(\D)/g, "");
    return numericInput[0] === "0" ? "+44" + numericInput.slice(1) : "+" + numericInput;
};

const PhoneNumberCard: React.FC<CardProps> = ({ formErrors, errorSetter, fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Phone Number" required={false}>
            <FreeFormTextInput
                label="Phone Number"
                defaultValue={getDefaultTextValue(fields, "phoneNumber")}
                error={errorExists(formErrors.phoneNumber)}
                helperText={errorText(formErrors.phoneNumber)}
                onChange={onChangeText(
                    fieldSetter,
                    errorSetter,
                    "phoneNumber",
                    false,
                    phoneNumberRegex,
                    formatPhoneNumber
                )}
            />
        </GenericFormCard>
    );
};

export default PhoneNumberCard;
