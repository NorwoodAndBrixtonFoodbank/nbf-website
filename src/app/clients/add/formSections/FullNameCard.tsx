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

const FullNameCard: React.FC<CardProps> = ({ formErrors, errorSetter, fieldSetter, fields }) => {
    return (
        <GenericFormCard title="Client Full Name" required={true} text="First and last name">
            <FreeFormTextInput
                label="Name"
                defaultValue={getDefaultTextValue(fields, "fullName")}
                error={errorExists(formErrors.fullName)}
                helperText={errorText(formErrors.fullName)}
                onChange={onChangeText(fieldSetter, errorSetter, "fullName", true)}
            />
        </GenericFormCard>
    );
};
export default FullNameCard;
