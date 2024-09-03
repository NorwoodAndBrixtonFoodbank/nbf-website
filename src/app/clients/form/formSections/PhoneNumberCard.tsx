import React from "react";
import FreeFormTextInput from "@/components/DataInput/FreeFormTextInput";
import {
    errorExists,
    getErrorText,
    getDefaultTextValue,
    onChangeText,
} from "@/components/Form/formFunctions";
import GenericFormCard from "@/components/Form/GenericFormCard";
import { ClientCardProps } from "../ClientForm";
import { phoneNumberRegex } from "@/common/format";

const formatPhoneNumber = (value: string): string => {
    const numericInput = value.replace(/(\D)/g, "");
    return numericInput[0] === "0" ? "+44" + numericInput.slice(1) : "+" + numericInput;
};

const PhoneNumberCard: React.FC<ClientCardProps> = ({
    formErrors,
    errorSetter,
    fieldSetter,
    fields,
}) => {
    return (
        <GenericFormCard title="Phone Number" required={false}>
            <FreeFormTextInput
                label="Phone Number"
                defaultValue={getDefaultTextValue(fields, "phoneNumber")}
                error={errorExists(formErrors.phoneNumber)}
                helperText={getErrorText(formErrors.phoneNumber)}
                onChange={onChangeText(fieldSetter, errorSetter, "phoneNumber", {
                    required: false,
                    regex: phoneNumberRegex,
                    formattingFunction: formatPhoneNumber,
                })}
            />
        </GenericFormCard>
    );
};

export default PhoneNumberCard;
